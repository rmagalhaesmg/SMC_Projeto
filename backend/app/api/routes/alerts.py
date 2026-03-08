"""
Alert Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_alerts():
    """Get user alerts"""
    return {"alerts": []}


@router.post("/")
async def create_alert():
    """Create a new alert"""
    return {"message": "Alert created"}


@router.delete("/{alert_id}")
async def delete_alert(alert_id: int):
    """Delete an alert"""
    return {"message": "Alert deleted"}


@router.post("/send-test")
async def send_test_alert():
    """Send test alert"""
    return {"message": "Test alert sent"}

