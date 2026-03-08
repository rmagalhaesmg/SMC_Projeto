"""
Alert Routes
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.notifications import send_telegram_alert, send_email_alert, send_whatsapp_alert
import asyncio

router = APIRouter()


@router.get("/")
async def get_alerts():
    """Get user alerts"""
    return {"alerts": []}


class AlertRequest(BaseModel):
    channel: str
    title: str
    message: str
    telegram_chat_id: Optional[str] = None
    email_to: Optional[str] = None
    whatsapp_phone: Optional[str] = None
    whatsapp_api_url: Optional[str] = None
    whatsapp_api_key: Optional[str] = None


@router.post("/")
async def create_alert(payload: AlertRequest):
    """Create a new alert and send"""
    ok = False
    if payload.channel == "telegram" and payload.telegram_chat_id:
        ok = await send_telegram_alert(f"{payload.title}\n{payload.message}", payload.telegram_chat_id)
    elif payload.channel == "email" and payload.email_to:
        ok = send_email_alert(payload.title, payload.message, payload.email_to)
    elif payload.channel == "whatsapp" and payload.whatsapp_phone and payload.whatsapp_api_url and payload.whatsapp_api_key:
        ok = await send_whatsapp_alert(payload.message, payload.whatsapp_phone, payload.whatsapp_api_url, payload.whatsapp_api_key)
    return {"sent": ok}


@router.delete("/{alert_id}")
async def delete_alert(alert_id: int):
    """Delete an alert"""
    return {"message": "Alert deleted"}


@router.post("/send-test")
async def send_test_alert():
    """Send test alert"""
    t = await send_telegram_alert("SMC Teste", None)
    e = send_email_alert("SMC Teste", "Teste", "test@example.com")
    w = await send_whatsapp_alert("Teste", "5511999999999", "https://api.z-api.io/instances/123/token/abc/chats/messages", "key")
    return {"telegram": t, "email": e, "whatsapp": w}

