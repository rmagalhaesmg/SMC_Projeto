"""
Modelos de Banco de Dados - SQLAlchemy
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum


Base = declarative_base()


class UserRole(str, enum.Enum):
    """Papéis de usuário"""
    USER = "user"
    ADMIN = "admin"
    MANAGER = "manager"


class SubscriptionPlan(str, enum.Enum):
    """Planos de assinatura"""
    FREE = "free"
    MONTHLY = "monthly"
    SEMESTRAL = "semestral"
    ANNUAL = "annual"


class User(Base):
    """Modelo de Usuário"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True)  # Nullable para OAuth
    role = Column(String(20), default=UserRole.USER.value)
    
    # Subscription
    plan = Column(String(20), default=SubscriptionPlan.FREE.value)
    subscription_start = Column(DateTime, nullable=True)
    subscription_end = Column(DateTime, nullable=True)
    stripe_customer_id = Column(String(255), nullable=True)
    mercadopago_customer_id = Column(String(255), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # OAuth
    google_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    trades = relationship("Trade", back_populates="user")
    signals = relationship("Signal", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    settings = relationship("UserSettings", back_populates="user", uselist=False)


class UserSettings(Base):
    """Configurações do usuário"""
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Trading Settings
    default_risk_percent = Column(Float, default=1.0)
    default_timeframe = Column(String(10), default="5")
    default_asset = Column(String(20), default="WIN")
    
    # Alert Settings
    alert_telegram = Column(Boolean, default=False)
    alert_whatsapp = Column(Boolean, default=False)
    alert_email = Column(Boolean, default=True)
    telegram_chat_id = Column(String(50), nullable=True)
    whatsapp_number = Column(String(20), nullable=True)
    
    # Display Settings
    theme = Column(String(10), default="dark")
    language = Column(String(10), default="pt-BR")
    
    # Relationships
    user = relationship("User", back_populates="settings")


class Trade(Base):
    """Modelo de Trade"""
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Trade Data
    date = Column(DateTime, default=datetime.utcnow)
    asset = Column(String(20), nullable=False)  # WIN, WDO, NQ, etc.
    market = Column(String(20), nullable=False)  # B3, CME, etc.
    setup = Column(String(50), nullable=True)  # FVG, BOS, Liquidity, etc.
    direction = Column(String(10), nullable=False)  # buy, sell
    
    entry = Column(Float, nullable=False)
    stop = Column(Float, nullable=False)
    target = Column(Float, nullable=True)
    exit_price = Column(Float, nullable=True)
    
    # Results
    result = Column(Float, nullable=True)  # P&L em pontos
    result_money = Column(Float, nullable=True)  # P&L em dinheiro
    risk_percent = Column(Float, nullable=False)
    risk_reward = Column(Float, nullable=True)
    
    # Psychology
    emotion_before = Column(String(50), nullable=True)
    emotion_after = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Status
    status = Column(String(20), default="open")  # open, closed
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="trades")


class Signal(Base):
    """Modelo de Sinal"""
    __tablename__ = "signals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Signal Data
    symbol = Column(String(20), nullable=False)
    timeframe = Column(String(10), nullable=False)
    direction = Column(String(10), nullable=False)  # buy, sell, neutral
    
    # Entry
    entry = Column(Float, nullable=False)
    stop = Column(Float, nullable=False)
    target = Column(Float, nullable=True)
    
    # Scores (from SMC Engine)
    score_hfz = Column(Float, nullable=True)
    score_fbi = Column(Float, nullable=True)
    score_dtm = Column(Float, nullable=True)
    score_sda = Column(Float, nullable=True)
    score_mtv = Column(Float, nullable=True)
    score_final = Column(Float, nullable=True)
    
    # Quality
    confidence = Column(Float, nullable=True)
    setup_type = Column(String(50), nullable=True)
    
    # Status
    status = Column(String(20), default="active")  # active, triggered, expired
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    triggered_at = Column(DateTime, nullable=True)
    expired_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="signals")


class Alert(Base):
    """Modelo de Alerta"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Alert Data
    type = Column(String(50), nullable=False)  # signal, trap, confluence, etc.
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="info")  # info, warning, error
    
    # Delivery
    channel = Column(String(20), nullable=False)  # telegram, whatsapp, email
    sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="alerts")


class Subscription(Base):
    """Modelo de Assinatura"""
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Subscription Data
    plan = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False)  # active, cancelled, past_due
    
    # Payment
    payment_method = Column(String(20), nullable=False)  # stripe, mercadopago
    payment_id = Column(String(255), nullable=True)  # ID do pagamento
    
    # Dates
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Amount
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="BRL")
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")


class MarketData(Base):
    """Modelo de Dados de Mercado"""
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Data
    symbol = Column(String(20), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    
    # OHLCV
    open = Column(Float, nullable=True)
    high = Column(Float, nullable=True)
    low = Column(Float, nullable=True)
    close = Column(Float, nullable=True)
    volume = Column(Float, nullable=True)
    
    # Additional
    tick_min = Column(Float, nullable=True)
    tick_volume = Column(Float, nullable=True)
    buy_volume = Column(Float, nullable=True)
    sell_volume = Column(Float, nullable=True)
    
    # Index for fast queries
    __table_args__ = (
        Index('idx_symbol_timestamp', 'symbol', 'timestamp'),
    )


# Index para otimização
from sqlalchemy import Index

