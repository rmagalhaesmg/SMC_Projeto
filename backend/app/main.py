"""
SMC Analysis Platform - Backend API
Sistema de Monitoramento Contínuo de Mercado
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
import app.api.routes as routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerenciamento do ciclo de vida da aplicação"""
    # Startup
    print("🚀 SMC Analysis Platform iniciando...")
    yield
    # Shutdown
    print("🛑 SMC Analysis Platform encerrando...")


app = FastAPI(
    title="SMC Analysis Platform API",
    description="API para análise institucional de mercado baseada em Smart Money Concepts",
    version="2.3.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes (using the unified routes module)
app.include_router(routes.router, prefix="/api", tags=["API"])


@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "name": "SMC Analysis Platform",
        "version": "2.3.0",
        "status": "online",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

