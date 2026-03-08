-- SMC Analysis Platform - Database Schema
-- PostgreSQL Database

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT,
    role VARCHAR(20) DEFAULT 'user',
    
    -- Subscription
    plan VARCHAR(20) DEFAULT 'free',
    subscription_start TIMESTAMP,
    subscription_end TIMESTAMP,
    stripe_customer_id VARCHAR(255),
    mercadopago_customer_id VARCHAR(255),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- OAuth
    google_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Trading Settings
    default_risk_percent FLOAT DEFAULT 1.0,
    default_timeframe VARCHAR(10) DEFAULT '5',
    default_asset VARCHAR(20) DEFAULT 'WIN',
    
    -- Alert Settings
    alert_telegram BOOLEAN DEFAULT FALSE,
    alert_whatsapp BOOLEAN DEFAULT FALSE,
    alert_email BOOLEAN DEFAULT TRUE,
    telegram_chat_id VARCHAR(50),
    whatsapp_number VARCHAR(20),
    
    -- Display Settings
    theme VARCHAR(10) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'pt-BR'
);

-- Trades Table
CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Trade Data
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    asset VARCHAR(20) NOT NULL,
    market VARCHAR(20) NOT NULL,
    setup VARCHAR(50),
    direction VARCHAR(10) NOT NULL,
    
    entry FLOAT NOT NULL,
    stop FLOAT NOT NULL,
    target FLOAT,
    exit_price FLOAT,
    
    -- Results
    result FLOAT,
    result_money FLOAT,
    risk_percent FLOAT NOT NULL,
    risk_reward FLOAT,
    
    -- Psychology
    emotion_before VARCHAR(50),
    emotion_after VARCHAR(50),
    notes TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'open',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Signals Table
CREATE TABLE signals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Signal Data
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    
    entry FLOAT NOT NULL,
    stop FLOAT NOT NULL,
    target FLOAT,
    
    -- Scores
    score_hfz FLOAT,
    score_fbi FLOAT,
    score_dtm FLOAT,
    score_sda FLOAT,
    score_mtv FLOAT,
    score_final FLOAT,
    
    -- Quality
    confidence FLOAT,
    setup_type VARCHAR(50),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP,
    expired_at TIMESTAMP
);

-- Alerts Table
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Alert Data
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    
    -- Delivery
    channel VARCHAR(20) NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Subscription Data
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    
    -- Payment
    payment_method VARCHAR(20) NOT NULL,
    payment_id VARCHAR(255),
    
    -- Dates
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMP,
    
    -- Amount
    amount FLOAT NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Data Table
CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    
    -- Data
    symbol VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    
    -- OHLCV
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    volume FLOAT,
    
    -- Additional
    tick_min FLOAT,
    tick_volume FLOAT,
    buy_volume FLOAT,
    sell_volume FLOAT
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_trades_user_date ON trades(user_id, date);
CREATE INDEX idx_trades_asset ON trades(asset);
CREATE INDEX idx_signals_user_status ON signals(user_id, status);
CREATE INDEX idx_market_symbol_timestamp ON market_data(symbol, timestamp);
CREATE INDEX idx_alerts_user_created ON alerts(user_id, created_at);

-- Subscriptions Index
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, name, password_hash, role, plan)
VALUES ('admin@smcanalysis.com', 'Administrator', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLhJ3K7y', 'admin', 'annual');

-- Insert sample user
INSERT INTO users (email, name, password_hash, role, plan)
VALUES ('user@smcanalysis.com', 'Demo User', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLhJ3K7y', 'user', 'monthly');

-- Insert sample settings
INSERT INTO user_settings (user_id, default_risk_percent, default_timeframe, default_asset)
VALUES (2, 1.0, '5', 'WIN');

-- Comment
COMMENT ON TABLE users IS 'Users table for SMC Analysis Platform';
COMMENT ON TABLE trades IS 'Trading journal entries';
COMMENT ON TABLE signals IS 'Generated trading signals from SMC Engine';
COMMENT ON TABLE alerts IS 'Alert notifications sent to users';

