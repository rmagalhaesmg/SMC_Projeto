# SMC Analysis Platform - Documentação Técnica

## Visão Geral

**SMC Analysis** é uma plataforma SaaS profissional de análise institucional baseada em Smart Money Concepts (SMC), reimplementando integralmente o indicador desenvolvido em NTSL (Neológica / Profit Pro).

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                         │
│         React • TypeScript • TailwindCSS • Recharts            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / WebSocket
┌────────────────────────────▼────────────────────────────────────┐
│                      BACKEND API (FastAPI)                       │
│         Auth • Billing • Orquestra • API RESTful                │
└────────────────────────────┬────────────────────────────────────┘
                             │ gRPC / IPC
┌────────────────────────────▼────────────────────────────────────┐
│                    CORE ENGINE (SMC Engine)                     │
│     HFZ • FBI • DTM • SDA • MTV • Score Engine • Filter        │
└────────────────────────────┬────────────────────────────────────┘
                             │ Eventos
┌────────────────────────────▼────────────────────────────────────┐
│                    DATA INGESTION LAYER                         │
│         RTD • DLL Neológica • API Profit • CSV Replay           │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
smc-analysis/
├── backend/                    # API Backend (FastAPI)
│   ├── app/
│   │   ├── api/routes/         # Endpoints da API
│   │   ├── core/              # Configurações e segurança
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── engine/            # Motor SMC
│   │   └── services/          # Serviços de negócio
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # Web App (Next.js)
│   ├── src/
│   │   ├── app/               # Páginas Next.js
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Serviços API
│   │   └── styles/            # Estilos globais
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── database/                  # Schema PostgreSQL
│   └── schema.sql
│
├── docker-compose.yml         # Orquestração Docker
└── README.md
```

## ⚙️ Módulos do Motor SMC

### 1. HFZ - Microestrutura e Fluxo
- **Delta**: Análise de fluxo de ordens agressoras
- **Hertz**: Frequência de operações por período
- **Absorção**: Detecção de ordens institucionais
- **Imbalance**: Desequilíbrio buy/sell
- **Pressão**: Pressão direcional

### 2. FBI - Contexto Espacial
- **Zonas Institucionais**: Detecção de zonas de liquidez
- **Suporte/Resistência**: Identificação de níveis importantes
- **Força de Zona**: Quantificação da importância

### 3. DTM - Detecção de Armadilhas
- **Trap Detection**: Bull/Bear traps
- **Falha de Continuidade**: Detecção de falhas
- **Eficiência**: Eficiência do deslocamento
- **Renovação**: Momentum renewal

### 4. SDA - Regime de Mercado
- **Tendência**: Identificação de tendência
- **Lateralização**: Detecção de consolidação
- **Volatilidade**: Análise de volatilidade

### 5. MTV - Multi-Timeframe
- **5 Timeframes**: Semanal, Diário, 240min, 60min, Base
- **Confluência**: Alinhamento entre TFs
- **Divergência**: Detecção de divergências

## 🔌 Integração de Dados

### Fontes Suportadas
- **RTD (Real-Time Data)**: Dados em tempo real
- **DLL Neológica**: Integração direta Profit
- **API Profit**: Via HTTP/WebSocket
- **CSV**: Replay e backtest

### Dados Processados
- Times & Trades
- Livro de Ofertas (Level 2)
- Volume total
- Volume agressor (buy/sell)
- OHLC
- Número de negócios
- Tick mínimo
- Timestamp HHMM

## 💳 Sistema de Assinaturas

### Planos
| Plano | Preço | Features |
|-------|-------|----------|
| Free | R$ 0 | 50 trades/mês |
| Mensal | R$ 199,99 | Completo |
| Semestral | R$ 999,99 | Completo + desconto |
| Anual | R$ 1.499,99 | Completo + melhor preço |

### Gateways
- **Stripe**: Cartão internacional
- **Mercado Pago**: Cartão + PIX Brasil

## 🤖 Integração IA

### LLMs Suportados
- **OpenAI** (GPT-4)
- **Google Gemini**

### Funções
- Interpretação de sinais
- Análise de estado de mercado
- Relatórios por sessão
- Chat com trader

## 🔔 Sistema de Alertas

### Canais
- **Telegram**: Bot API
- **WhatsApp**: Twilio/Z-API
- **E-mail**: SMTP/SendGrid

### Tipos de Alerta
- Sinais de compra/venda
- Contato com zona
- Trap detectado
- Confluência MTV
- Divergência

## 🚀 Quick Start

### Docker Compose (Recomendado)

```bash
# Clone o repositório
cd smc-analysis

# Inicie todos os serviços
docker-compose up -d

# Acesse
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Desenvolvimento Manual

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📋 Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smc_analysis

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=sua-chave-secreta

# OAuth Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payments
STRIPE_SECRET_KEY=
MERCADOPAGO_ACCESS_TOKEN=

# AI
OPENAI_API_KEY=
GOOGLE_GEMINI_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Sinais
- `GET /api/signals` - Lista sinais
- `POST /api/signals` - Criar sinal
- `GET /api/signals/{id}` - Detalhar sinal

### Mercado
- `GET /api/market/data` - Dados de mercado
- `GET /api/market/realtime` - WebSocket dados realtime

### Analytics
- `GET /api/analytics/performance` - Performance
- `GET /api/analytics/statistics` - Estatísticas

## 🔒 Segurança

- JWT Authentication
- OAuth 2.0 (Google)
- Rate Limiting
- CORS configurável
- Hash de senhas (bcrypt)

## 📈 Escalabilidade

A arquitetura está preparada para:
- **Kubernetes**: Orquestração
- **Redis**: Cache e pub/sub
- **Celery**: Tarefas assíncronas
- **Kafka**: Stream de dados
- **CDN**: Cloudflare

## 📄 Licença

MIT License

## 👨‍💻 Equipe

Desenvolvido para traders profissionais e fundos quantitativos.

---

**SMC Analysis Platform v2.3.0**

