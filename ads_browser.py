"""
AdsPower Browser API wrapper.
Handles profile creation, starting/stopping browser sessions,
and obtaining Selenium WebDriver connections.

Supports 9Proxy GB-traffic proxies (niceproxy.io) where each profile
gets a unique session ID so that every browser runs on its own IP.
"""

import logging
import random
import string
from urllib.parse import urlparse, urlunparse

import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService

import config

logger = logging.getLogger(__name__)

SSID_PLACEHOLDER = "_ssid_"


def _generate_session_id(length: int = 8) -> str:
    """Random alphanumeric session ID for 9Proxy sticky sessions."""
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def parse_proxy_template(raw_line: str) -> str | None:
    """Return a cleaned proxy line (template) or None for blanks/comments."""
    line = raw_line.strip()
    if not line or line.startswith("#"):
        return None
    return line


def build_proxy_for_profile(template: str, profile_index: int) -> dict:
    """
    Take a proxy template string, replace the ``_ssid_`` placeholder with
    a unique session ID, then parse into the dict AdsPower expects.

    Supported template formats (9Proxy GB-traffic and regular):
        socks5://user:pass@host:port          (URL style)
        http://user:pass@host:port
        host:port:user:pass                   (legacy)
        user:pass@host:port                   (compact)

    9Proxy example:
        socks5://sub_user-country-US-ssid-_ssid_-sst-120:pwd@niceproxy.io:17521

    The ``_ssid_`` token is replaced with a per-profile random ID so that
    each AdsPower profile gets a different residential IP.
    """
    unique_ssid = _generate_session_id()
    line = template.replace(SSID_PLACEHOLDER, unique_ssid)

    scheme_map = {"socks5": "socks5", "socks4": "socks4", "http": "http", "https": "https"}

    parsed = urlparse(line)
    if parsed.scheme in scheme_map:
        proxy_type = scheme_map[parsed.scheme]
        host = parsed.hostname or ""
        port = str(parsed.port) if parsed.port else ""
        user = parsed.username or ""
        password = parsed.password or ""
    elif "@" in line:
        auth_part, addr_part = line.rsplit("@", 1)
        host_port = addr_part.split(":")
        host = host_port[0]
        port = host_port[1] if len(host_port) > 1 else ""
        cred = auth_part.split(":", 1)
        user = cred[0]
        password = cred[1] if len(cred) > 1 else ""
        proxy_type = "socks5"
    else:
        parts = line.split(":")
        if len(parts) == 4:
            host, port, user, password = parts
        elif len(parts) == 2:
            host, port = parts
            user, password = "", ""
        else:
            logger.warning("Cannot parse proxy: %s", line)
            return _empty_proxy()
        proxy_type = "socks5"

    logger.info(
        "Profile #%d → %s://%s:%s (session %s)",
        profile_index, proxy_type, host, port, unique_ssid,
    )

    return {
        "proxy_soft": "other",
        "proxy_type": proxy_type,
        "proxy_host": host,
        "proxy_port": port,
        "proxy_user": user,
        "proxy_password": password,
    }


def _empty_proxy() -> dict:
    return {
        "proxy_soft": "other",
        "proxy_type": "socks5",
        "proxy_host": "",
        "proxy_port": "",
        "proxy_user": "",
        "proxy_password": "",
    }


class AdsPowerClient:
    """Thin wrapper around the AdsPower Local API."""

    def __init__(self, api_url: str | None = None):
        self.api_url = (api_url or config.ADS_API_URL).rstrip("/")

    # ------------------------------------------------------------------
    # Health
    # ------------------------------------------------------------------
    def status(self) -> dict:
        resp = requests.get(f"{self.api_url}/status", timeout=10)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Groups
    # ------------------------------------------------------------------
    def get_or_create_group(self, group_name: str) -> str:
        """Return group_id for *group_name*; create it if it doesn't exist."""
        resp = requests.get(
            f"{self.api_url}/api/v1/group/list",
            params={"page_size": 100},
            timeout=15,
        )
        data = resp.json()
        if data.get("code") == 0:
            for g in data.get("data", {}).get("list", []):
                if g.get("group_name") == group_name:
                    return g["group_id"]

        resp = requests.post(
            f"{self.api_url}/api/v1/group/create",
            json={"group_name": group_name},
            timeout=15,
        )
        data = resp.json()
        if data.get("code") != 0:
            raise RuntimeError(f"Failed to create group: {data}")
        return data["data"]["group_id"]

    # ------------------------------------------------------------------
    # Profiles
    # ------------------------------------------------------------------
    def list_profiles(self, group_id: str | None = None) -> list[dict]:
        params: dict = {"page_size": 100}
        if group_id:
            params["group_id"] = group_id
        resp = requests.get(
            f"{self.api_url}/api/v1/user/list",
            params=params,
            timeout=15,
        )
        data = resp.json()
        if data.get("code") != 0:
            raise RuntimeError(f"Failed to list profiles: {data}")
        return data.get("data", {}).get("list", [])

    def create_profile(
        self,
        name: str,
        group_id: str,
        proxy: dict | None = None,
    ) -> str:
        """Create a new browser profile and return its user_id.

        *proxy* — optional dict from ``parse_proxy()``.  When provided the
        profile is created with this proxy baked in so that every browser
        launch uses it automatically.
        """
        payload: dict = {
            "name": name,
            "group_id": group_id,
            "fingerprint_config": {
                "automatic_timezone": "1",
                "language": ["ru-RU", "ru", "en-US", "en"],
                "ua": "",
            },
        }
        if proxy:
            payload["user_proxy_config"] = proxy
            logger.info(
                "Profile '%s' → proxy %s://%s:%s",
                name,
                proxy.get("proxy_type", "?"),
                proxy.get("proxy_host", "?"),
                proxy.get("proxy_port", "?"),
            )

        resp = requests.post(
            f"{self.api_url}/api/v1/user/create",
            json=payload,
            timeout=30,
        )
        data = resp.json()
        if data.get("code") != 0:
            raise RuntimeError(f"Failed to create profile '{name}': {data}")
        user_id = data["data"]["id"]
        logger.info("Created AdsPower profile '%s' → %s", name, user_id)
        return user_id

    def delete_profile(self, user_id: str) -> None:
        requests.post(
            f"{self.api_url}/api/v1/user/delete",
            json={"user_ids": [user_id]},
            timeout=15,
        )

    # ------------------------------------------------------------------
    # Browser start / stop
    # ------------------------------------------------------------------
    def start_browser(self, user_id: str) -> dict:
        """Open the browser for *user_id* and return connection info."""
        resp = requests.get(
            f"{self.api_url}/api/v1/browser/start",
            params={"user_id": user_id},
            timeout=60,
        )
        data = resp.json()
        if data.get("code") != 0:
            raise RuntimeError(f"Failed to start browser {user_id}: {data}")
        return data["data"]

    def stop_browser(self, user_id: str) -> None:
        requests.get(
            f"{self.api_url}/api/v1/browser/stop",
            params={"user_id": user_id},
            timeout=30,
        )
        logger.info("Stopped browser for profile %s", user_id)

    # ------------------------------------------------------------------
    # Selenium driver
    # ------------------------------------------------------------------
    def get_driver(self, user_id: str) -> webdriver.Chrome:
        """Start the profile browser and return a connected Selenium WebDriver."""
        info = self.start_browser(user_id)
        selenium_addr = info["ws"]["selenium"]
        webdriver_path = info.get("webdriver", "")

        chrome_options = ChromeOptions()
        chrome_options.add_experimental_option("debuggerAddress", selenium_addr)

        if webdriver_path:
            service = ChromeService(executable_path=webdriver_path)
            driver = webdriver.Chrome(service=service, options=chrome_options)
        else:
            driver = webdriver.Chrome(options=chrome_options)

        driver.implicitly_wait(10)
        logger.info("Connected Selenium to profile %s", user_id)
        return driver
