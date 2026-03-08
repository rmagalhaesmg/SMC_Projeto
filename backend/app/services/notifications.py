import asyncio
import smtplib
from email.mime.text import MIMEText
from typing import Optional
import aiohttp
from app.core.config import settings


async def send_telegram_alert(message: str, chat_id: Optional[str] = None) -> bool:
    token = settings.TELEGRAM_BOT_TOKEN
    if not token or not chat_id:
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=payload) as resp:
            return resp.status == 200


def send_email_alert(subject: str, message: str, to_email: str) -> bool:
    host = settings.SMTP_HOST
    port = settings.SMTP_PORT
    user = settings.SMTP_USER
    pwd = settings.SMTP_PASSWORD
    from_email = settings.SMTP_FROM_EMAIL
    if not host or not user or not pwd or not to_email:
        return False
    msg = MIMEText(message, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email
    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, pwd)
            server.sendmail(from_email, [to_email], msg.as_string())
        return True
    except Exception:
        return False


async def send_whatsapp_alert(message: str, phone: str, api_url: str, api_key: str) -> bool:
    if not api_url or not api_key or not phone:
        return False
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"phone": phone, "message": message}
    async with aiohttp.ClientSession() as session:
        async with session.post(api_url, json=payload, headers=headers) as resp:
            return resp.status == 200

