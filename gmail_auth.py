"""
Gmail authentication via Selenium.
Handles the full Google sign-in flow:
  1. Enter email address
  2. Enter password
  3. (Optional) Confirm recovery email if prompted
"""

import time
import random
import logging

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    ElementClickInterceptedException,
)

import config

logger = logging.getLogger(__name__)


def _random_delay(lo: float, hi: float) -> None:
    time.sleep(random.uniform(lo, hi))


def _human_type(element, text: str) -> None:
    """Simulate human-like typing with small random delays between keystrokes."""
    for ch in text:
        element.send_keys(ch)
        time.sleep(random.uniform(0.04, 0.15))


def login_gmail(
    driver: WebDriver,
    email: str,
    password: str,
    recovery_email: str | None = None,
) -> bool:
    """
    Walk through the Google sign-in flow.
    Returns True on success, False on failure.
    """
    wait = WebDriverWait(driver, 30)

    try:
        # ---- Step 1: open login page ----
        logger.info("Opening Gmail login page for %s …", email)
        driver.get(config.GMAIL_LOGIN_URL)
        _random_delay(config.DELAY_PAGE_LOAD, config.DELAY_PAGE_LOAD + 3)

        # ---- Step 2: enter email ----
        logger.info("Entering email …")
        email_input = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="email"]'))
        )
        email_input.clear()
        _human_type(email_input, email)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        next_btn = driver.find_element(By.ID, "identifierNext")
        next_btn.click()
        _random_delay(config.DELAY_PAGE_LOAD, config.DELAY_PAGE_LOAD + 2)

        # ---- Step 3: enter password ----
        logger.info("Entering password …")
        password_input = wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, 'input[type="password"]')
            )
        )
        password_input.clear()
        _human_type(password_input, password)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        pass_next = driver.find_element(By.ID, "passwordNext")
        pass_next.click()
        _random_delay(config.DELAY_PAGE_LOAD, config.DELAY_PAGE_LOAD + 3)

        # ---- Step 4: handle possible recovery-email challenge ----
        if recovery_email:
            _handle_recovery_email(driver, wait, recovery_email)

        # ---- Step 5: wait until Gmail inbox loads ----
        _wait_for_inbox(driver, wait)

        logger.info("Successfully logged in to %s", email)
        return True

    except Exception:
        logger.exception("Login failed for %s", email)
        return False


def _handle_recovery_email(
    driver: WebDriver,
    wait: WebDriverWait,
    recovery_email: str,
) -> None:
    """
    If Google shows a 'Confirm your recovery email' challenge,
    click the third option button and enter the recovery email.
    """
    try:
        _random_delay(2, 4)

        recovery_buttons = driver.find_elements(
            By.CSS_SELECTOR, 'div[data-challengetype]'
        )
        if not recovery_buttons:
            recovery_buttons = driver.find_elements(
                By.CSS_SELECTOR, 'li[data-challengetype]'
            )

        if not recovery_buttons:
            buttons = driver.find_elements(
                By.CSS_SELECTOR, 'div[role="link"], div[role="button"]'
            )
            for btn in buttons:
                text_lower = btn.text.lower()
                if any(kw in text_lower for kw in [
                    "резервн", "recovery", "подтверд", "confirm",
                    "запасн", "backup",
                ]):
                    logger.info("Clicking recovery-email challenge button …")
                    btn.click()
                    _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)
                    break
        else:
            target_idx = min(2, len(recovery_buttons) - 1)
            logger.info("Clicking challenge option #%d …", target_idx + 1)
            recovery_buttons[target_idx].click()
            _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        recovery_input = wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, 'input[type="email"]')
            )
        )
        recovery_input.clear()
        _human_type(recovery_input, recovery_email)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        next_btn = driver.find_element(By.CSS_SELECTOR, 'button[type="button"]')
        buttons = driver.find_elements(By.CSS_SELECTOR, "button")
        for btn in buttons:
            text_lower = btn.text.lower()
            if any(kw in text_lower for kw in ["далее", "next", "подтвердить"]):
                btn.click()
                break
        else:
            recovery_input.send_keys(Keys.ENTER)

        _random_delay(config.DELAY_PAGE_LOAD, config.DELAY_PAGE_LOAD + 2)
        logger.info("Recovery email submitted.")

    except TimeoutException:
        logger.debug("No recovery-email challenge detected — continuing.")
    except Exception:
        logger.warning("Could not handle recovery challenge", exc_info=True)


def _wait_for_inbox(driver: WebDriver, wait: WebDriverWait) -> None:
    """Wait until the Gmail inbox page is loaded (or at least redirected)."""
    try:
        wait.until(lambda d: "mail.google.com" in d.current_url)
        _random_delay(config.DELAY_AFTER_LOGIN_MIN, config.DELAY_AFTER_LOGIN_MAX)
    except TimeoutException:
        logger.warning(
            "Timed out waiting for inbox redirect — current URL: %s",
            driver.current_url,
        )
