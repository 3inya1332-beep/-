"""
Gmail message sender via Selenium.
Opens the Gmail compose window and sends an email.
"""

import time
import random
import logging

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

import config

logger = logging.getLogger(__name__)


def _random_delay(lo: float, hi: float) -> None:
    time.sleep(random.uniform(lo, hi))


def _human_type(element, text: str) -> None:
    for ch in text:
        element.send_keys(ch)
        time.sleep(random.uniform(0.03, 0.12))


def send_email(
    driver: WebDriver,
    to_email: str,
    subject: str,
    body: str,
) -> bool:
    """
    Compose and send a single email from the currently-open Gmail inbox.
    Returns True on success, False on failure.
    """
    wait = WebDriverWait(driver, 20)

    try:
        # Make sure we're on the Gmail page
        if "mail.google.com" not in driver.current_url:
            driver.get("https://mail.google.com/mail/")
            _random_delay(config.DELAY_PAGE_LOAD, config.DELAY_PAGE_LOAD + 2)

        # ---- Click "Compose" button ----
        logger.info("Clicking Compose for %s …", to_email)
        compose_btn = _find_compose_button(driver, wait)
        compose_btn.click()
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX + 1)

        # ---- Fill "To" field ----
        to_field = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[name="to"]'))
        )
        to_field.clear()
        _human_type(to_field, to_email)
        _random_delay(0.5, 1.0)
        to_field.send_keys(Keys.TAB)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        # ---- Fill "Subject" field ----
        subj_field = driver.find_element(By.CSS_SELECTOR, 'input[name="subjectbox"]')
        subj_field.clear()
        _human_type(subj_field, subject)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        # ---- Fill message body ----
        body_field = driver.find_element(
            By.CSS_SELECTOR, 'div[aria-label="Тело сообщения"], '
                             'div[aria-label="Message Body"], '
                             'div[role="textbox"][aria-multiline="true"]'
        )
        body_field.click()
        _random_delay(0.3, 0.8)
        _human_type(body_field, body)
        _random_delay(config.DELAY_ACTION_MIN, config.DELAY_ACTION_MAX)

        # ---- Click Send ----
        send_btn = _find_send_button(driver)
        send_btn.click()
        _random_delay(2, 4)

        logger.info("Email sent to %s", to_email)
        return True

    except Exception:
        logger.exception("Failed to send email to %s", to_email)
        _try_discard_draft(driver)
        return False


def _find_compose_button(driver: WebDriver, wait: WebDriverWait):
    """Locate the Compose / Написать button."""
    selectors = [
        'div.T-I.T-I-KE.L3',
        'div[gh="cm"]',
        'div[role="button"][tabindex="0"]',
    ]
    for sel in selectors:
        try:
            btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, sel)))
            return btn
        except TimeoutException:
            continue

    buttons = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
    for btn in buttons:
        text_lower = btn.text.lower().strip()
        if text_lower in ("написать", "compose", "nouveau message", "redactar"):
            return btn

    raise RuntimeError("Could not find the Compose button")


def _find_send_button(driver: WebDriver):
    """Locate the Send / Отправить button inside the compose window."""
    selectors = [
        'div[aria-label*="Отправить"]',
        'div[aria-label*="Send"]',
        'div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    ]
    for sel in selectors:
        elems = driver.find_elements(By.CSS_SELECTOR, sel)
        if elems:
            return elems[0]

    buttons = driver.find_elements(By.CSS_SELECTOR, 'div[role="button"]')
    for btn in buttons:
        text = btn.text.strip().lower()
        if text in ("отправить", "send", "envoyer", "enviar"):
            return btn

    raise RuntimeError("Could not find the Send button")


def _try_discard_draft(driver: WebDriver) -> None:
    """Try to close/discard any open compose window to leave Gmail clean."""
    try:
        close_btns = driver.find_elements(
            By.CSS_SELECTOR, 'img[aria-label="Discard draft"], '
                             'img[aria-label="Удалить черновик"], '
                             'img[data-tooltip="Discard draft"], '
                             'img[data-tooltip="Удалить черновик"]'
        )
        if close_btns:
            close_btns[0].click()
    except Exception:
        pass
