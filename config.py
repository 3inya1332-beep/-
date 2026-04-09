"""
Configuration for Gmail Sender with AdsPower Browser.
Edit these settings to match your environment.
"""

# --- AdsPower settings ---
# Подключение напрямую через соединение, без API Key.
# В AdsPower: «Проверка API» должна быть ВЫКЛЮЧЕНА.
ADS_API_URL = "http://local.adspower.net:50325"

# --- File paths ---
ACCOUNTS_FILE = "data/accounts.txt"
EMAILS_FILE = "data/emails.txt"
PROXIES_FILE = "data/proxies.txt"
SUBJECT_FILE = "templates/subject.txt"
MESSAGE_FILE = "templates/message.txt"

# --- Delay settings (seconds) ---
DELAY_BETWEEN_MESSAGES_MIN = 30
DELAY_BETWEEN_MESSAGES_MAX = 60

DELAY_BETWEEN_ACCOUNTS_MIN = 5
DELAY_BETWEEN_ACCOUNTS_MAX = 15

DELAY_AFTER_LOGIN_MIN = 5
DELAY_AFTER_LOGIN_MAX = 10

DELAY_PAGE_LOAD = 5
DELAY_ACTION_MIN = 1
DELAY_ACTION_MAX = 3

# --- Gmail login URL ---
GMAIL_LOGIN_URL = (
    "https://accounts.google.com/v3/signin/identifier"
    "?authuser=0"
    "&continue=https%3A%2F%2Fmail.google.com%2Fmail"
    "&ec=GAlAFw"
    "&hl=ru"
    "&service=mail"
    "&flowName=GlifWebSignIn"
    "&flowEntry=AddSession"
    "&dsh=S1279049779%3A1775754019432214"
)

# --- Profile naming ---
ADS_PROFILE_PREFIX = "gmail_sender_"

# --- Group name for created profiles in AdsPower ---
ADS_GROUP_NAME = "Gmail Sender"
