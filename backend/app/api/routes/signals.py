"""
Signal Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_signals():
    """Get all signals"""
    return {"signals": []}


@router.get("/{signal_id}")
async def get_signal(signal_id: int):
    """Get signal by ID"""
    return {"id": signal_id, "symbol": "WIN", "direction": "buy"}


@router.post("/")
async def create_signal():
    """Create a new signal"""
    return {"message": "Signal created"}


@router.delete("/{signal_id}")
async def delete_signal(signal_id: int):
    """Delete a signal"""
    return {"message": "Signal deleted"}

