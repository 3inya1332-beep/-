# Gmail Sender via AdsPower Browser

Automated Gmail sender that uses **AdsPower Anti-Detect Browser** profiles.  
Each Gmail account gets its own isolated browser profile.  
Recipient emails are distributed across accounts in **round-robin** order.

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Python 3.10+** | Uses `X \| None` type syntax |
| **AdsPower** | Must be running locally (default API: `http://local.adspower.net:50325`) |
| **Google Chrome** | Managed by AdsPower |

## Installation

```bash
pip install -r requirements.txt
```

## File structure

```
├── main.py              # Entry point
├── config.py            # All settings (delays, paths, URLs)
├── ads_browser.py       # AdsPower API wrapper
├── gmail_auth.py        # Google sign-in automation
├── gmail_sender.py      # Gmail compose & send
├── data/
│   ├── accounts.txt     # Gmail accounts (one per line)
│   ├── emails.txt       # Recipient emails (one per line)
│   └── proxies.txt      # Proxy list (one per line)
└── templates/
    ├── subject.txt      # Email subject line
    └── message.txt      # Email body text
```

## Account format (`data/accounts.txt`)

```
# gmail:password[:recovery_email]
itx.ashely.graham@gmail.com:97hNwg9cVMh:cefisin162@merumart.com
john.doe@gmail.com:MySecurePass
```

- **recovery_email** — optional; used when Google asks to confirm the backup address during login.

## Proxy list (`data/proxies.txt`)

```
# protocol://user:password@host:port
socks5://malanda43_UAZs-country-_country_-ssid-_ssid_-sst-120:ff322@niceproxy.io:17521
http://user:pass@proxy.example.com:8080
```

Supported protocols: `socks5`, `socks4`, `http`, `https`.

Proxies are distributed across accounts in round-robin order.
If you have 2 proxies and 5 accounts, accounts 1 & 3 & 5 use proxy 1, accounts 2 & 4 use proxy 2.
If the file is empty or missing, profiles are created without a proxy.

## Recipient list (`data/emails.txt`)

```
recipient1@example.com
recipient2@example.com
recipient3@example.com
```

## Usage

### Full run (login + send)

```bash
python main.py
```

### Login only (create profiles, log in, no sending)

```bash
python main.py --login-only
```

### Keep browsers open after sending

```bash
python main.py --no-cleanup
```

### Custom file paths

```bash
python main.py \
  --accounts my_accounts.txt \
  --emails my_recipients.txt \
  --proxies my_proxies.txt \
  --subject-file my_subject.txt \
  --message-file my_body.txt
```

## Round-robin distribution

If you have **3 accounts** and **7 recipients**, emails are assigned like this:

| Recipient # | Account used |
|-------------|-------------|
| 1 | Account 1 |
| 2 | Account 2 |
| 3 | Account 3 |
| 4 | Account 1 |
| 5 | Account 2 |
| 6 | Account 3 |
| 7 | Account 1 |

Each compose window sends **one email to one recipient**, then moves on.

## Configuration (`config.py`)

All delays and settings are in `config.py`:

| Setting | Default | Description |
|---------|---------|-------------|
| `DELAY_BETWEEN_MESSAGES_MIN/MAX` | 30–60 s | Pause between sending each email |
| `DELAY_BETWEEN_ACCOUNTS_MIN/MAX` | 5–15 s | Pause between logging into accounts |
| `DELAY_AFTER_LOGIN_MIN/MAX` | 5–10 s | Wait after successful login |
| `DELAY_PAGE_LOAD` | 5 s | Base page-load wait |
| `DELAY_ACTION_MIN/MAX` | 1–3 s | Small pauses between UI actions |
| `ADS_API_URL` | `http://local.adspower.net:50325` | AdsPower local API address |
| `ADS_PROFILE_PREFIX` | `gmail_sender_` | Prefix for created profile names |

## How it works

1. **Reads** accounts from `data/accounts.txt`, recipients from `data/emails.txt`, proxies from `data/proxies.txt`
2. **Connects** to the running AdsPower application via its local HTTP API
3. **Creates** one browser profile per Gmail account (with proxy if available)
4. **Opens** each profile, navigates to the Google sign-in page, enters credentials
5. If Google asks for recovery email verification — enters the backup address automatically
6. **Distributes** recipient emails across logged-in accounts (round-robin)
7. For each recipient: clicks Compose, fills in To / Subject / Body, clicks Send
8. **Closes** all browsers and profiles when finished (unless `--no-cleanup`)
