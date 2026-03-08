"""
SMC SaaS - Backend Principal
FastAPI - Deploy: Railway
"""
import os
import sys
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Path setup
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("smc.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.start_time = datetime.now(timezone.utc)
    logger.info("🚀 Iniciando SMC Analysis Backend...")

    # Setup DB
    from app.core.database import engine, Base, AsyncSessionLocal

    await engine.connect()
    await engine.run_sync(Base.metadata.create_all)
    
    logger.info("✅ Backend pronto")
    yield
    await engine.dispose()
    logger.info("👋 Backend encerrado")


# ============================================================
# APP
# ============================================================
app = FastAPI(
    title="SMC Analysis API",
    description="Sistema de Análise SMC com IA",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ROUTERS
# ============================================================

# Auth
from app.api.routes.auth import router as auth_router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Users
from app.api.routes.users import router as users_router
app.include_router(users_router, prefix="/users", tags=["users"])

# Market
from app.api.routes.market import router as market_router
app.include_router(market_router, prefix="/market", tags=["market"])

# Signals
from app.api.routes.signals import router as signals_router
app.include_router(signals_router, prefix="/signals", tags=["signals"])

# Alerts
from app.api.routes.alerts import router as alerts_router
app.include_router(alerts_router, prefix="/alerts", tags=["alerts"])

# Analytics
from app.api.routes.analytics import router as analytics_router
app.include_router(analytics_router, prefix="/analytics", tags=["analytics"])

# Subscriptions
from app.api.routes.subscriptions import router as subscriptions_router
app.include_router(subscriptions_router, prefix="/subscriptions", tags=["subscriptions"])


# ============================================================
# PUBLIC ENDPOINTS
# ============================================================
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "uptime_seconds": (datetime.now(timezone.utc) - app.state.start_time).total_seconds(),
    }


@app.get("/")
def root():
    return {
        "app": "SMC Analysis API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
    }


# ============================================================
# LOCAL DEV
# ============================================================
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

