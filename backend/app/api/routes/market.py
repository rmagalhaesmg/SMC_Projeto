"""
Market Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/symbols")
async def get_symbols():
    """Get available symbols"""
    return {"symbols": ["WIN", "WDO", "NDX", "ES", "NQ"]}


@router.get("/quote/{symbol}")
async def get_quote(symbol: str):
    """Get quote for symbol"""
    return {
        "symbol": symbol,
        "bid": 125000,
        "ask": 125010,
        "last": 125005,
        "volume": 150000
    }


@router.get("/history/{symbol}")
async def get_history(symbol: str):
    """Get historical data"""
    return {"symbol": symbol, "data": []}

