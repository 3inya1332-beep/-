#!/usr/bin/env python3
"""
Gmail Sender — main entry point.

Workflow
--------
1. Parse accounts from data/accounts.txt
2. Parse recipient emails from data/emails.txt
3. Read subject & message templates
4. For each account: create an AdsPower profile, log in to Gmail
5. Distribute recipients round-robin across accounts
6. Send emails with configurable delays
"""

import sys
import time
import random
import logging
import argparse
from pathlib import Path

import config
from ads_browser import AdsPowerClient, parse_proxy_template, build_proxy_for_profile
from gmail_auth import login_gmail
from gmail_sender import send_email

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("main")


# ======================================================================
# Data helpers
# ======================================================================

def load_accounts(path: str) -> list[dict]:
    """
    Read accounts file.
    Format per line: email:password[:recovery_email]
    Lines starting with # are ignored.
    """
    accounts = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(":")
        if len(parts) < 2:
            logger.warning("Skipping malformed line: %s", line)
            continue
        entry = {
            "email": parts[0],
            "password": parts[1],
            "recovery": parts[2] if len(parts) > 2 else None,
        }
        accounts.append(entry)
    return accounts


def load_emails(path: str) -> list[str]:
    """Read recipient email list (one per line, # comments ignored)."""
    emails = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#"):
            emails.append(line)
    return emails


def load_proxy_templates(path: str) -> list[str]:
    """Read proxy template lines from file (one per line, # = comment).

    Each line is a proxy *template* — may contain ``_ssid_`` placeholder
    that will be replaced with a unique session ID per profile.
    """
    templates: list[str] = []
    if not Path(path).exists():
        return templates
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        t = parse_proxy_template(raw)
        if t:
            templates.append(t)
    return templates


def load_text(path: str) -> str:
    return Path(path).read_text(encoding="utf-8").strip()


# ======================================================================
# Core logic
# ======================================================================

def setup_profiles(
    ads: AdsPowerClient,
    accounts: list[dict],
    proxy_templates: list[str] | None = None,
) -> list[dict]:
    """
    For every account create an AdsPower profile (with unique proxy if
    templates are available), start the browser, log in to Gmail.

    Each profile receives its own session ID so 9Proxy assigns a
    different IP per browser.
    """
    group_id = ads.get_or_create_group(config.ADS_GROUP_NAME)
    profiles = []

    for idx, acct in enumerate(accounts, start=1):
        name = f"{config.ADS_PROFILE_PREFIX}{idx}"

        proxy = None
        if proxy_templates:
            tpl = proxy_templates[(idx - 1) % len(proxy_templates)]
            proxy = build_proxy_for_profile(tpl, idx)

        logger.info("[%d/%d] Creating profile '%s' for %s …",
                     idx, len(accounts), name, acct["email"])
        user_id = ads.create_profile(name, group_id, proxy=proxy)

        try:
            driver = ads.get_driver(user_id)
            ok = login_gmail(
                driver,
                acct["email"],
                acct["password"],
                acct.get("recovery"),
            )
            profiles.append({
                "account": acct,
                "user_id": user_id,
                "driver": driver,
                "logged_in": ok,
            })
            if ok:
                logger.info("Account %s — logged in ✓", acct["email"])
            else:
                logger.warning("Account %s — login FAILED", acct["email"])
        except Exception:
            logger.exception("Could not start browser for %s", acct["email"])
            profiles.append({
                "account": acct,
                "user_id": user_id,
                "driver": None,
                "logged_in": False,
            })

        delay = random.uniform(
            config.DELAY_BETWEEN_ACCOUNTS_MIN,
            config.DELAY_BETWEEN_ACCOUNTS_MAX,
        )
        logger.info("Waiting %.1f s before next account …", delay)
        time.sleep(delay)

    return profiles


def send_round_robin(
    profiles: list[dict],
    recipients: list[str],
    subject: str,
    body: str,
) -> None:
    """
    Distribute *recipients* across *profiles* in round-robin order
    and send one email per recipient.
    """
    active = [p for p in profiles if p["logged_in"] and p["driver"]]
    if not active:
        logger.error("No active (logged-in) accounts — aborting send phase.")
        return

    total = len(recipients)
    success = 0
    fail = 0

    for i, rcpt in enumerate(recipients):
        profile = active[i % len(active)]
        acct_email = profile["account"]["email"]
        logger.info(
            "[%d/%d] Sending from %s → %s",
            i + 1, total, acct_email, rcpt,
        )

        ok = send_email(profile["driver"], rcpt, subject, body)
        if ok:
            success += 1
        else:
            fail += 1

        if i < total - 1:
            delay = random.uniform(
                config.DELAY_BETWEEN_MESSAGES_MIN,
                config.DELAY_BETWEEN_MESSAGES_MAX,
            )
            logger.info("Waiting %.1f s before next message …", delay)
            time.sleep(delay)

    logger.info("Done — sent: %d, failed: %d, total: %d", success, fail, total)


def cleanup(ads: AdsPowerClient, profiles: list[dict]) -> None:
    for p in profiles:
        try:
            if p.get("driver"):
                p["driver"].quit()
        except Exception:
            pass
        try:
            ads.stop_browser(p["user_id"])
        except Exception:
            pass


# ======================================================================
# CLI
# ======================================================================

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Gmail bulk sender via AdsPower browser profiles",
    )
    p.add_argument(
        "--accounts", default=config.ACCOUNTS_FILE,
        help="Path to accounts file (default: %(default)s)",
    )
    p.add_argument(
        "--emails", default=config.EMAILS_FILE,
        help="Path to recipient emails file (default: %(default)s)",
    )
    p.add_argument(
        "--proxies", default=config.PROXIES_FILE,
        help="Path to proxies file (default: %(default)s)",
    )
    p.add_argument(
        "--subject-file", default=config.SUBJECT_FILE,
        help="Path to subject template (default: %(default)s)",
    )
    p.add_argument(
        "--message-file", default=config.MESSAGE_FILE,
        help="Path to message body template (default: %(default)s)",
    )
    p.add_argument(
        "--login-only", action="store_true",
        help="Only create profiles and log in — do not send emails",
    )
    p.add_argument(
        "--no-cleanup", action="store_true",
        help="Keep browser profiles open after finishing",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()

    # ---- Load data ----
    accounts = load_accounts(args.accounts)
    if not accounts:
        logger.error("No accounts found in %s — exiting.", args.accounts)
        sys.exit(1)
    logger.info("Loaded %d account(s)", len(accounts))

    recipients = load_emails(args.emails)
    if not recipients and not args.login_only:
        logger.error("No recipient emails in %s — exiting.", args.emails)
        sys.exit(1)
    logger.info("Loaded %d recipient(s)", len(recipients))

    proxy_templates = load_proxy_templates(args.proxies)
    if proxy_templates:
        logger.info(
            "Loaded %d proxy template(s) — каждый профиль получит уникальный session ID",
            len(proxy_templates),
        )
    else:
        logger.info("Прокси не загружены — профили будут без прокси")

    subject = load_text(args.subject_file)
    body = load_text(args.message_file)

    # ---- Connect to AdsPower (без API Key, через прямое соединение) ----
    ads = AdsPowerClient()
    try:
        status = ads.status()
        logger.info("AdsPower подключён: %s", status)
    except Exception:
        logger.error(
            "Не удалось подключиться к AdsPower по адресу %s\n"
            "  → Убедитесь что AdsPower запущен\n"
            "  → Галочка «Проверка API» должна быть ВЫКЛЮЧЕНА",
            config.ADS_API_URL,
        )
        sys.exit(1)

    # ---- Create profiles & log in ----
    profiles = setup_profiles(ads, accounts, proxy_templates=proxy_templates)

    if args.login_only:
        logger.info("--login-only mode: skipping email sending.")
        if not args.no_cleanup:
            input("Press Enter to close all browsers …")
            cleanup(ads, profiles)
        return

    # ---- Send emails ----
    send_round_robin(profiles, recipients, subject, body)

    # ---- Cleanup ----
    if not args.no_cleanup:
        cleanup(ads, profiles)
        logger.info("All browsers closed.")
    else:
        logger.info("--no-cleanup: browsers left open.")


if __name__ == "__main__":
    main()
