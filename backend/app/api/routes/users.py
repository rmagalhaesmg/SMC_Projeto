"""
User Routes
"""

from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/")
async def get_users():
    """Get all users"""
    return {"users": []}


@router.get("/{user_id}")
async def get_user(user_id: int):
    """Get user by ID"""
    return {"id": user_id, "email": "user@example.com"}


@router.put("/{user_id}")
async def update_user(user_id: int):
    """Update user"""
    return {"message": "User updated", "id": user_id}

