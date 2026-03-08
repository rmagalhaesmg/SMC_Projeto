"""
API Routes - SMC Analysis Platform
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import asyncio
import random
from app.engine.smc_engine import SMCEngine, Snapshot, LiquidityParams
import os
import csv
from math import tanh, sqrt

router = APIRouter()
security = HTTPBearer()

class SignalResponse(BaseModel):
    id: int
    symbol: str
    timeframe: str
    direction: str
    entry: float
    stop: float
    target: Optional[float]
    score_final: float
    setup_type: Optional[str]
    status: str
    created_at: datetime


class MarketDataResponse(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: float
    high: float
    low: float
    open: float


class SMCScoresResponse(BaseModel):
    hfz: float
    fbi: float
    dtm: float
    sda: float
    mtv: float
    final: float
    direction: str
    estado_mercado: int
    qualidade_setup: int
    eventos: List[str]


# ==================== SIGNALS ROUTES ====================

@router.get("/signals", response_model=List[SignalResponse])
async def get_signals(
    limit: int = 50,
    symbol: Optional[str] = None,
    direction: Optional[str] = None
):
    """Lista sinais gerados"""
    # Mock data for demo
    return [
        {
            "id": 1,
            "symbol": "WIN",
            "timeframe": "5",
            "direction": "buy",
            "entry": 125000,
            "stop": 124800,
            "target": 125500,
            "score_final": 78,
            "setup_type": "BOS + FVG",
            "status": "active",
            "created_at": datetime.now()
        }
    ]


@router.get("/signals/{signal_id}", response_model=SignalResponse)
async def get_signal(signal_id: int):
    """Detalha um sinal específico"""
    return {
        "id": signal_id,
        "symbol": "WIN",
        "timeframe": "5",
        "direction": "buy",
        "entry": 125000,
        "stop": 124800,
        "target": 125500,
        "score_final": 78,
        "setup_type": "BOS + FVG",
        "status": "active",
        "created_at": datetime.now()
    }


# ==================== MARKET ROUTES ====================

@router.get("/market/data")
async def get_market_data(symbol: str = "WIN"):
    """Retorna dados de mercado"""
    return {
        "symbol": symbol,
        "price": 125350.0,
        "change": 250.0,
        "change_percent": 0.20,
        "volume": 1523456,
        "high": 125500.0,
        "low": 124800.0,
        "open": 125100.0,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/market/realtime/{symbol}")
async def get_realtime_data(symbol: str):
    """Stream de dados em tempo real (WebSocket)"""
    return {
        "symbol": symbol,
        "bid": 125350.0,
        "ask": 125355.0,
        "last": 125352.0,
        "volume": 15234,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/market/smc-scores", response_model=SMCScoresResponse)
async def get_smc_scores(symbol: str = "WIN", timeframe: str = "5"):
    """Retorna scores SMC em tempo real"""
    engine = SMCEngine(liquidity_params=getattr(router, "liq_params", LiquidityParams()))
    snap = Snapshot(
        price=125350.0,
        open=125100.0,
        high=125500.0,
        low=124800.0,
        close=125350.0,
        volume=150000.0,
        buy_volume=80000.0,
        sell_volume=70000.0,
        atr=250.0,
        delta=0.8,
        hz=1.2,
        absorcao=1.6,
        imbalance=0.5,
        pressao_compra=0.6,
        pressao_venda=0.4,
        dist_zona=0.02,
        forca_zona=1.6,
        reacao_zona=0.7,
        regime=0.7,
        vol_rel=1.3,
        continuacao=0.6,
        deslocamento=180.0,
        confluencia_tfs=0.8,
        divergencia_tfs=0.2,
    )
    res = engine.compute(snap)
    return res.__dict__


@router.websocket("/market/ws")
async def ws_market(websocket: WebSocket):
    await websocket.accept()
    engine = SMCEngine(liquidity_params=getattr(router, "liq_params", LiquidityParams()))
    try:
        while True:
            base_price = 125000.0
            price = base_price + random.uniform(-300, 300)
            buy_vol = random.uniform(40000, 90000)
            sell_vol = random.uniform(40000, 90000)
            snap = Snapshot(
                price=price,
                open=price - random.uniform(-50, 50),
                high=price + random.uniform(0, 150),
                low=price - random.uniform(0, 150),
                close=price,
                volume=buy_vol + sell_vol,
                buy_volume=buy_vol,
                sell_volume=sell_vol,
                atr=250.0,
                delta=(buy_vol - sell_vol) / max(1.0, buy_vol + sell_vol),
                hz=random.uniform(0.1, 2.0),
                absorcao=random.uniform(0.5, 2.0),
                imbalance=random.uniform(0.0, 1.0),
                pressao_compra=random.uniform(0.0, 1.0),
                pressao_venda=random.uniform(0.0, 1.0),
                dist_zona=random.uniform(0.0, 0.05),
                forca_zona=random.uniform(0.8, 2.0),
                reacao_zona=random.uniform(0.0, 1.0),
                regime=random.uniform(0.2, 0.9),
                vol_rel=random.uniform(0.5, 2.0),
                continuacao=random.uniform(0.0, 1.0),
                deslocamento=random.uniform(50.0, 300.0),
                confluencia_tfs=random.uniform(0.0, 1.0),
                divergencia_tfs=random.uniform(0.0, 1.0),
            )
            res = engine.compute(snap)
            zones = engine.estimate_liquidity(snap)
            payload = {
                "symbol": "WIN",
                "price": price,
                "scores": res.__dict__,
                "liquidity": [z.__dict__ for z in zones],
                "timestamp": datetime.now().isoformat(),
            }
            await websocket.send_json(payload)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        return


@router.websocket("/market/ws-replay")
async def ws_market_replay(websocket: WebSocket):
    await websocket.accept()
    params = dict(websocket.query_params)
    file_path = params.get("file")
    if not file_path or not os.path.exists(file_path):
        await websocket.send_json({"error": "file not found"})
        await websocket.close()
        return
    # CSV streaming (sem dependências externas)
    with open(file_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        headers = [h.lower() for h in reader.fieldnames or []]
    required = {"time", "open", "high", "low", "close"}
    if not required.issubset(set(headers)):
        await websocket.send_json({"error": "csv must have time,open,high,low,close"})
        await websocket.close()
        return
    with open(file_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        cols = {c.lower(): c for c in reader.fieldnames or []}
    engine = SMCEngine(liquidity_params=getattr(router, "liq_params", LiquidityParams()))
    atr_window = 14
    highs = []
    lows = []
    closes = []
    try:
        with open(file_path, "r", encoding="utf-8-sig") as f2:
            reader2 = csv.DictReader(f2)
            for row in reader2:
                o = float(row[cols["open"]])
                h = float(row[cols["high"]])
                l = float(row[cols["low"]])
                c = float(row[cols["close"]])
            highs.append(h)
            lows.append(l)
            closes.append(c)
            if len(highs) > atr_window:
                highs.pop(0)
                lows.pop(0)
                closes.pop(0)
            trs = []
            for i in range(len(highs)):
                prev = closes[i - 1] if i > 0 else closes[i]
                tr = max(highs[i] - lows[i], abs(highs[i] - prev), abs(lows[i] - prev))
                trs.append(tr)
            atr = sum(trs) / max(1, len(trs))
            vol = float(row[cols["volume"]]) if "volume" in cols and row.get(cols["volume"]) not in (None, "") else max(1.0, (h - l) * 10.0)
            up = c >= o
            buy_vol = vol * (0.6 if up else 0.4)
            sell_vol = vol - buy_vol
            snap = Snapshot(
                price=c,
                open=o,
                high=h,
                low=l,
                close=c,
                volume=vol,
                buy_volume=buy_vol,
                sell_volume=sell_vol,
                atr=atr if atr > 0 else max(1.0, (h - l)),
                delta=(buy_vol - sell_vol) / max(1.0, vol),
                hz=1.0,
                absorcao=max(0.5, (h - l) / max(1.0, atr)) if atr > 0 else 1.0,
                imbalance=abs((buy_vol - sell_vol) / max(1.0, vol)),
                pressao_compra=buy_vol / max(1.0, vol),
                pressao_venda=sell_vol / max(1.0, vol),
                dist_zona=abs(c - o) / max(1.0, atr),
                forca_zona=1.2,
                reacao_zona=0.6,
                regime=0.6,
                vol_rel=(h - l) / max(1.0, atr),
                continuacao=max(0.0, min(1.0, (c - o) / max(1.0, atr))),
                deslocamento=abs(c - o),
                confluencia_tfs=0.6,
                divergencia_tfs=0.2,
            )
            res = engine.compute(snap)
            zones = engine.estimate_liquidity(snap)
            payload = {
                "symbol": params.get("symbol", "WIN"),
                "price": c,
                "scores": res.__dict__,
                "liquidity": [z.__dict__ for z in zones],
                "timestamp": str(row.get(cols["time"], "")),
            }
            await websocket.send_json(payload)
            await asyncio.sleep(float(params.get("delay", "0.2")))
    except WebSocketDisconnect:
        return


class LiquidityParamsModel(BaseModel):
    w_strength: float = 0.7
    w_distance: float = 0.3
    offset_main_atr: float = 0.0
    offset_side_atr: float = 0.5
    min_strength: float = 0.2


@router.get("/liquidity/params")
async def get_liquidity_params():
    lp: LiquidityParams = getattr(router, "liq_params", LiquidityParams())
    return lp.__dict__


@router.post("/liquidity/params")
async def set_liquidity_params(params: LiquidityParamsModel):
    router.liq_params = LiquidityParams(**params.model_dump())
    return {"status": "ok", "params": params.model_dump()}


@router.post("/liquidity/calibrate")
async def calibrate_liquidity(file: str, horizon: int = 3):
    if not os.path.exists(file):
        raise HTTPException(status_code=400, detail="file not found")
    with open(file, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        cols = {c.lower(): c for c in reader.fieldnames or []}
    req = {"open", "high", "low", "close"}
    if not req.issubset(set(cols.keys())):
        raise HTTPException(status_code=400, detail="csv must have open,high,low,close")
    opens: List[float] = []
    highs: List[float] = []
    lows: List[float] = []
    closes: List[float] = []
    with open(file, "r", encoding="utf-8-sig") as f:
        reader2 = csv.DictReader(f)
        for row in reader2:
            opens.append(float(row[cols["open"]]))
            highs.append(float(row[cols["high"]]))
            lows.append(float(row[cols["low"]]))
            closes.append(float(row[cols["close"]]))
    n = len(closes)
    # ATR simples (média dos TR nos últimos 14, com preenchimento)
    atr: List[float] = []
    for i in range(n):
        prev = closes[i - 1] if i > 0 else closes[i]
        tr = max(highs[i] - lows[i], abs(highs[i] - prev), abs(lows[i] - prev))
        atr.append(tr)
    # média móvel simples
    win = 14
    atr_smooth: List[float] = []
    acc = 0.0
    for i in range(n):
        acc += atr[i]
        if i >= win:
            acc -= atr[i - win]
        atr_smooth.append(acc / float(min(i + 1, win)))
    # features
    rng = [max(1.0, highs[i] - lows[i]) for i in range(n)]
    forca = [rng[i] / max(1.0, atr_smooth[i]) for i in range(n)]
    dist_raw = [abs(closes[i] - opens[i]) / max(1.0, atr_smooth[i]) for i in range(n)]
    dist = [1.0 - tanh(v) for v in dist_raw]
    # alvo: magnitude de movimento futuro
    target = [0.0] * n
    for i in range(n - horizon):
        target[i] = abs(closes[i + horizon] - closes[i])
    # busca de pesos
    best = {"corr": -1.0, "w_strength": None, "w_distance": None}
    grid = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
    for w in grid:
        k = [w * tanh(forca[i]) + (1 - w) * dist[i] for i in range(n)]
        # correlação de Pearson
        m1 = sum(k[:-horizon]) / max(1, (n - horizon))
        m2 = sum(target[:-horizon]) / max(1, (n - horizon))
        num = 0.0
        d1 = 0.0
        d2 = 0.0
        for i in range(n - horizon):
            a = k[i] - m1
            b = target[i] - m2
            num += a * b
            d1 += a * a
            d2 += b * b
        den = sqrt(d1) * sqrt(d2)
        corr = (num / den) if den > 0 else 0.0
        if corr > best["corr"]:
            best = {"corr": float(corr), "w_strength": float(w), "w_distance": float(1 - w)}
    # aplica no router
    router.liq_params = LiquidityParams(w_strength=best["w_strength"], w_distance=best["w_distance"])
    return {"status": "ok", "best": best}


# ==================== ANALYTICS ROUTES ====================

@router.get("/analytics/performance")
async def get_performance(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Retorna performance do usuário"""
    return {
        "total_trades": 156,
        "winrate": 62.5,
        "profit_factor": 2.3,
        "avg_win": 320.50,
        "avg_loss": -180.25,
        "expectancy": 142.35,
        "max_drawdown": -1250.00,
        "current_streak": 5,
        "best_streak": 12,
        "worst_streak": -8
    }


@router.get("/analytics/statistics")
async def get_statistics():
    """Retorna estatísticas gerais"""
    return {
        "por_setup": {
            "FVG": {"trades": 45, "winrate": 68.5},
            "BOS": {"trades": 38, "winrate": 72.1},
            "Liquidity": {"trades": 32, "winrate": 58.3},
            "OrderBlock": {"trades": 28, "winrate": 65.0}
        },
        "por_horario": {
            "9:30-10:00": {"trades": 42, "winrate": 71.4},
            "10:00-11:00": {"trades": 35, "winrate": 62.8},
            "11:00-12:00": {"trades": 28, "winrate": 55.6}
        },
        "por_ativo": {
            "WIN": {"trades": 85, "winrate": 64.7},
            "WDO": {"trades": 45, "winrate": 58.2},
            "NASDAQ": {"trades": 26, "winrate": 65.4}
        }
    }


# ==================== SUBSCRIPTIONS ROUTES ====================

@router.get("/subscriptions/plans")
async def get_plans():
    """Lista planos disponíveis"""
    return {
        "plans": [
            {
                "id": "free",
                "name": "Gratuito",
                "price": 0,
                "features": ["50 trades/mês", "Basic analytics"]
            },
            {
                "id": "monthly",
                "name": "Mensal",
                "price": 199.99,
                "features": ["Sinais ilimitados", "Análise completa", "Alertas"]
            },
            {
                "id": "semestral",
                "name": "Semestral",
                "price": 999.99,
                "features": ["Tudo do mensal", "Backtest", "Desconto 17%"]
            },
            {
                "id": "annual",
                "name": "Anual",
                "price": 1499.99,
                "features": ["Tudo do semestral", "IA Insights", "Desconto 37%"]
            }
        ]
    }


@router.post("/subscriptions/checkout")
async def create_checkout(plan_id: str):
    """Cria sessão de checkout"""
    return {
        "checkout_url": "https://checkout.stripe.com/...",
        "session_id": "cs_test_..."
    }


# ==================== ALERTS ROUTES ====================

@router.get("/alerts")
async def get_alerts(limit: int = 50):
    """Lista alertas do usuário"""
    return [
        {
            "id": 1,
            "type": "signal",
            "title": "Sinal de COMPRA - WIN",
            "message": "Score: 78% - BOS + FVG detectado",
            "severity": "success",
            "channel": "telegram",
            "sent": True,
            "created_at": datetime.now().isoformat()
        }
    ]


@router.post("/alerts/config")
async def configure_alerts(
    alert_telegram: bool = True,
    alert_email: bool = True,
    alert_whatsapp: bool = False
):
    """Configura preferências de alertas"""
    return {"status": "success", "message": "Alertas configurados"}


# ==================== BACKTEST ROUTES ====================

@router.post("/backtest/run")
async def run_backtest(
    symbol: str,
    timeframe: str,
    start_date: str,
    end_date: str,
    initial_capital: float = 10000
):
    """Executa backtest"""
    return {
        "id": "bt_123",
        "status": "running",
        "progress": 0,
        "estimated_time": "5 minutos"
    }


@router.get("/backtest/{backtest_id}")
async def get_backtest_result(backtest_id: str):
    """Retorna resultado do backtest"""
    return {
        "id": backtest_id,
        "status": "completed",
        "results": {
            "total_trades": 456,
            "winrate": 62.5,
            "profit_factor": 2.3,
            "max_drawdown": -8.5,
            "sharpe_ratio": 1.85,
            "avg_trade": 142.35
        }
    }

