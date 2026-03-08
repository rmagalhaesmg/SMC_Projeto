'use client' 

import React, { useEffect, useState, useMemo } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import KPICard from '@/components/dashboard/KPICard'
import FloatingMenu from '@/components/ui/FloatingMenu'
import { createSMCWebSocket, RealtimeMessage } from '@/services/realtime'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'

export default function Dashboard() {
  const [lastMsg, setLastMsg] = useState<RealtimeMessage | null>(null)
  const scores = lastMsg?.scores
  useEffect(() => {
    const ws = createSMCWebSocket((msg) => setLastMsg(msg))
    return () => ws.close()
  }, [])
  const estadoLabel = useMemo(() => {
    if (!scores) return '---'
    if (scores.estado_mercado === 1) return 'Tendência'
    if (scores.estado_mercado === 0) return 'Lateral'
    return 'Transição'
  }, [scores])
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      <FloatingMenu />
      
      <main className="ml-[260px] pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Dashboard
            </h1>
            <p className="text-text-secondary mt-1">
              Visão geral do mercado em tempo real
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 bg-bg-card rounded-lg border border-border-primary">
            <div className="w-3 h-3 rounded-full bg-accent-success live-indicator" />
            <span className="text-sm text-text-secondary">
              Mercado Aberto • WIN • {new Date().toLocaleTimeString()}
            </span>
            <span className="ml-auto text-sm text-accent-success">
              Sinais ativos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              title="Score Compra"
              value={scores ? Math.round(scores.final * 100) : '—'}
              change={5.2}
              changeLabel="vs ontem"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="success"
            />
            <KPICard
              title="Score Venda"
              value={scores ? Math.max(0, 100 - Math.round(scores.final * 100)) : '—'}
              change={-3.1}
              changeLabel="vs ontem"
              icon={<TrendingDown className="w-5 h-5" />}
              variant="danger"
            />
            <KPICard
              title="Estado Mercado"
              value={scores ? scores.direction === 'buy' ? 'Compra' : 'Venda' : '—'}
              icon={<Target className="w-5 h-5" />}
              variant="success"
            />
            <KPICard
              title="Qualidade Setup"
              value={scores ? `${scores.qualidade_setup}/10` : '—'}
              icon={<Zap className="w-5 h-5" />}
              variant="default"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">HFZ</span>
                <span className="text-xs px-2 py-1 rounded bg-accent-primary/20 text-accent-primary">
                  Microestrutura
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-accent-primary">{scores ? scores.hfz.toFixed(2) : '—'}</div>
              <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary rounded-full" style={{ width: `${scores ? Math.round(scores.hfz * 100) : 0}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">FBI</span>
                <span className="text-xs px-2 py-1 rounded bg-accent-warning/20 text-accent-warning">
                  Zonas
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-accent-warning">{scores ? scores.fbi.toFixed(2) : '—'}</div>
              <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-accent-warning rounded-full" style={{ width: `${scores ? Math.round(scores.fbi * 100) : 0}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">DTM</span>
                <span className="text-xs px-2 py-1 rounded bg-accent-danger/20 text-accent-danger">
                  Traps
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-accent-danger">{scores ? scores.dtm.toFixed(2) : '—'}</div>
              <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-accent-danger rounded-full" style={{ width: `${scores ? Math.round(scores.dtm * 100) : 0}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">SDA</span>
                <span className="text-xs px-2 py-1 rounded bg-accent-secondary/20 text-accent-secondary">
                  Regime
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-accent-secondary">{scores ? scores.sda.toFixed(2) : '—'}</div>
              <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-accent-secondary rounded-full" style={{ width: `${scores ? Math.round(scores.sda * 100) : 0}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">MTV</span>
                <span className="text-xs px-2 py-1 rounded bg-trade-liquidity/20 text-trade-liquidity">
                  Multi-TF
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-trade-liquidity">{scores ? scores.mtv.toFixed(2) : '—'}</div>
              <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-trade-liquidity rounded-full" style={{ width: `${scores ? Math.round(scores.mtv * 100) : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Signals Feed */}
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-text-primary">
                  Sinais Recentes
                </h2>
                <button className="text-sm text-accent-primary hover:underline">
                  Ver todos
                </button>
              </div>

              <div className="space-y-3">
                {/* Signal Item */}
                <div className="flex items-center gap-4 p-3 bg-bg-tertiary rounded-lg border border-trade-buy/30">
                  <div className="w-10 h-10 rounded-lg bg-trade-buy/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-trade-buy" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-trade-buy">COMPRA</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-secondary">WIN</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-muted">5min</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Confluência: BOS + FVG + Liquidity Sweep
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-trade-buy">78%</span>
                    <p className="text-xs text-text-muted">Score</p>
                  </div>
                </div>

                {/* Signal Item */}
                <div className="flex items-center gap-4 p-3 bg-bg-tertiary rounded-lg border border-trade-sell/30">
                  <div className="w-10 h-10 rounded-lg bg-trade-sell/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-trade-sell" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-trade-sell">VENDA</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-secondary">WDO</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-muted">15min</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Confluência: Bear Trap + CHoCH
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-trade-sell">65%</span>
                    <p className="text-xs text-text-muted">Score</p>
                  </div>
                </div>

                {/* Signal Item */}
                <div className="flex items-center gap-4 p-3 bg-bg-tertiary rounded-lg border border-accent-warning/30">
                  <div className="w-10 h-10 rounded-lg bg-accent-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-accent-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-accent-warning">BLOQUEADO</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-secondary">NASDAQ</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-sm text-text-muted">60min</span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Divergência detectada - Evitar entrada
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-accent-warning">42%</span>
                    <p className="text-xs text-text-muted">Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Panel */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-text-primary">
                  Eventos
                </h2>
                <span className="text-xs px-2 py-1 rounded bg-accent-success/20 text-accent-success">
                  3 novos
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                  <CheckCircle className="w-4 h-4 text-accent-success mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary">Contato com zona de liquidez</p>
                    <p className="text-xs text-text-muted">Há 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                  <AlertTriangle className="w-4 h-4 text-accent-warning mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary">Bear Trap detectado</p>
                    <p className="text-xs text-text-muted">Há 12 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                  <Activity className="w-4 h-4 text-accent-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary">Confluência MTV forte</p>
                    <p className="text-xs text-text-muted">Há 25 minutos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
                  <BarChart3 className="w-4 h-4 text-trade-liquidity mt-0.5" />
                  <div>
                    <p className="text-sm text-text-primary">Expansão de volatilidade</p>
                    <p className="text-xs text-text-muted">Há 1 hora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Timeframe Panel */}
          <div className="mt-6 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-text-primary">
                Análise Multi-Timeframe
              </h2>
              <div className="flex gap-2">
                {scores && (
                  <span className="text-xs px-3 py-1 rounded bg-accent-success/20 text-accent-success">
                    Confluência: {scores.mtv > 0.7 ? 'ALTA' : scores.mtv > 0.4 ? 'MÉDIA' : 'BAIXA'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {/* Weekly */}
              <div className="p-4 bg-bg-tertiary rounded-lg text-center">
                <p className="text-xs text-text-muted mb-2">Semanal</p>
                <div className="w-12 h-12 mx-auto rounded-full bg-trade-buy/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-trade-buy" />
                </div>
                <p className="text-sm font-semibold text-trade-buy">ALTA</p>
                <p className="text-xs text-text-muted">85%</p>
              </div>

              {/* Daily */}
              <div className="p-4 bg-bg-tertiary rounded-lg text-center">
                <p className="text-xs text-text-muted mb-2">Diário</p>
                <div className="w-12 h-12 mx-auto rounded-full bg-trade-buy/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-trade-buy" />
                </div>
                <p className="text-sm font-semibold text-trade-buy">ALTA</p>
                <p className="text-xs text-text-muted">78%</p>
              </div>

              {/* 240min */}
              <div className="p-4 bg-bg-tertiary rounded-lg text-center">
                <p className="text-xs text-text-muted mb-2">240min</p>
                <div className="w-12 h-12 mx-auto rounded-full bg-trade-buy/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-trade-buy" />
                </div>
                <p className="text-sm font-semibold text-trade-buy">ALTA</p>
                <p className="text-xs text-text-muted">72%</p>
              </div>

              {/* 60min */}
              <div className="p-4 bg-bg-tertiary rounded-lg text-center">
                <p className="text-xs text-text-muted mb-2">60min</p>
                <div className="w-12 h-12 mx-auto rounded-full bg-accent-warning/20 flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-accent-warning" />
                </div>
                <p className="text-sm font-semibold text-accent-warning">NEUTRO</p>
                <p className="text-xs text-text-muted">55%</p>
              </div>

              {/* Base (5min) */}
              <div className="p-4 bg-bg-tertiary rounded-lg text-center">
                <p className="text-xs text-text-muted mb-2">5min</p>
                <div className="w-12 h-12 mx-auto rounded-full bg-trade-buy/20 flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-trade-buy" />
                </div>
                <p className="text-sm font-semibold text-trade-buy">COMPRA</p>
                <p className="text-xs text-text-muted">82%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

