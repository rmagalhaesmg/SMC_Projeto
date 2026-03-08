"""
SMC SaaS - Backend Principal (Clean Version)
FastAPI + Auth + Alerts + AI + Billing + WebSocket
Deploy: Railway
"""
import os
import sys
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Path setup for engines
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
    from app.database import engine, Base, SessionLocal, DATABASE_URL
    from app.auth.models import User, Subscription
    from app.models.signal import Signal

    if DATABASE_URL.startswith("sqlite"):
        path = DATABASE_URL.replace("sqlite:///", "")
        dirpath = os.path.dirname(path)
        if dirpath and not os.path.exists(dirpath):
            os.makedirs(dirpath, exist_ok=True)

    Base.metadata.create_all(bind=engine)

    # Create default admin user if none exists
    from passlib.context import CryptContext
    pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = SessionLocal()
    try:
        if not db.query(User).first():
            admin = User(
                email="admin@smc.local",
                password_hash=pwd_ctx.hash("admin"),
                is_active=True
            )
            db.add(admin)
            db.flush()
            sub = Subscription(user_id=admin.id, plan="admin", status="active")
            db.add(sub)
            db.commit()
            logger.info("✅ Admin padrão criado: admin@smc.local / admin")
    except Exception as e:
        db.rollback()
        logger.warning(f"Erro ao criar admin padrão: {e}")
    finally:
        db.close()

    logger.info("✅ Backend pronto")
    yield
    logger.info("👋 Backend encerrado")


# ============================================================
# APP
# ============================================================
app = FastAPI(
    title="SMC Analysis API",
    description="Sistema de Análise SMC com IA — v2.3",
    version="2.3.0",
    lifespan=lifespan,
)

# CORS — em prod, troque por seus domínios
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
from app.auth.router import router as auth_router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Subscription guard middleware
from app.middleware.subscription_guard import SubscriptionGuard
app.add_middleware(SubscriptionGuard)

# Analysis + Stats
from app.routes.analysis import router as analysis_router
from app.routes.stats import router as stats_router
app.include_router(analysis_router, prefix="/analysis", tags=["analysis"])
app.include_router(stats_router, prefix="/analysis", tags=["stats"])

# Billing
from app.billing.router import router as billing_router
from app.billing.webhooks import router as webhook_router
app.include_router(billing_router, prefix="/billing", tags=["billing"])
app.include_router(webhook_router, prefix="/billing/webhook", tags=["webhooks"])

# Alerts (Telegram / Email / WhatsApp)
from app.alerts.router import router as alerts_router
app.include_router(alerts_router, tags=["alerts"])

# Data ingestion (CSV upload)
from app.ingestion.csv_upload import router as ingestion_router
app.include_router(ingestion_router, prefix="/ingestion", tags=["ingestion"])

# WebSocket
from app.websocket.routes import router as ws_router
app.include_router(ws_router, tags=["websocket"])

# Admin
from app.admin.router import router as admin_router
app.include_router(admin_router, prefix="/admin", tags=["admin"])

# Data routes
from app.routes.data import router as data_router
app.include_router(data_router, prefix="/data", tags=["data"])

# Signals
from app.routes.signals import router as signals_router
app.include_router(signals_router, tags=["signals"])


# ============================================================
# PUBLIC ENDPOINTS
# ============================================================
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": "2.3.0",
        "uptime_seconds": (datetime.now(timezone.utc) - app.state.start_time).total_seconds(),
    }


@app.get("/")
def root():
    return {
        "app": "SMC Analysis API",
        "version": "2.3.0",
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
