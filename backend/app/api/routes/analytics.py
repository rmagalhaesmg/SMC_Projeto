"""
Analytics Routes
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/performance")
async def get_performance():
    """Get performance metrics"""
    return {
        "winrate": 0.65,
        "profit_factor": 2.3,
        "avg_win": 150,
        "avg_loss": 80,
        "total_trades": 150
    }


@router.get("/drawdown")
async def get_drawdown():
    """Get drawdown data"""
    return {"max_drawdown": 5.2, "current_drawdown": 1.2}


@router.get("/equity-curve")
async def get_equity_curve():
    """Get equity curve data"""
    return {"data": [10000, 10200, 10500, 10300, 10800]}

