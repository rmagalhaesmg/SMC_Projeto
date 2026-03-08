# SMC Projeto - Plataforma de Análise Institucional

## Sistema de Monitoramento Contínuo de Mercado - SaaS Platform

Plataforma profissional de análise institucional baseada em Smart Money Concepts (SMC), reimplementando integralmente o indicador desenvolvido em NTSL (Neológica / Profit Pro).

### 🚀 Características Principais

- **Motor SMC Completo**: HFZ, FBI, DTM, SDA, MTV
- **Arquitetura SaaS**: Autenticação, Assinaturas, Pagamentos
- **AI Integration**: LLM para interpretação de sinais
- **Alertas em Tempo Real**: Telegram, WhatsApp, E-mail
- **Design Institucional**: Estilo Bloomberg Terminal / TradingView

### 🛠️ Stack Tecnológico

#### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- Recharts
- Lucide React

#### Backend
- Python FastAPI
- PostgreSQL
- Redis
- JWT Authentication
- Stripe / Mercado Pago

#### Engine
- Python (Pandas, NumPy)
- C++ (futuro - performance)

### 📁 Estrutura do Projeto

```
smc-analysis/
├── frontend/          # Next.js Web App
├── backend/           # FastAPI Backend
├── engine/           # SMC Core Engine
├── database/         # PostgreSQL Schema
├── docs/             # Documentação
└── docker/           # Docker Compose
```

### 🔧 Quick Start

```bash
# Clone o repositório
cd smc-analysis

# Inicie com Docker
docker-compose up -d

# Ou desenvolvimento manual
cd backend && pip install -r requirements.txt
cd frontend && npm install
```

### 📄 Licença

MIT License - Para uso comercial, entre em contato.

---

**Desenvolvido para traders profissionais e fundos quantitativos.**

