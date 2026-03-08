"""
Subscription Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_subscription():
    """Get current subscription"""
    return {
        "plan": "free",
        "status": "active",
        "expires_at": None
    }


@router.post("/create-checkout-session")
async def create_checkout_session(plan: str):
    """Create Stripe checkout session"""
    return {"session_url": "https://checkout.stripe.com/mock"}


@router.post("/webhook")
async def subscription_webhook():
    """Handle subscription webhook"""
    return {"message": "Webhook received"}

