'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { Target, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

// Dados mockados para demonstração
const signals = [
  { id: 1, type: 'BUY', asset: 'WIN', timeframe: '5min', score: 82, time: '10:32', status: 'active', confluence: 'BOS + FVG + Liquidity Sweep' },
  { id: 2, type: 'SELL', asset: 'WDO', timeframe: '15min', score: 68, time: '10:15', status: 'active', confluence: 'Bear Trap + CHoCH' },
  { id: 3, type: 'BUY', asset: 'WIN', timeframe: '60min', score: 75, time: '09:45', status: 'closed', confluence: 'FVG + Order Block' },
  { id: 4, type: 'BLOCKED', asset: 'NASDAQ', timeframe: '60min', score: 42, time: '09:30', status: 'blocked', confluence: 'Divergência detectada' },
  { id: 5, type: 'SELL', asset: 'DOLFUT', timeframe: '5min', score: 71, time: '09:20', status: 'active', confluence: 'Supply Zone + FVG' },
]

export default function SignalsPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUY': return 'text-trade-buy bg-trade-buy/10 border-trade-buy/30'
      case 'SELL': return 'text-trade-sell bg-trade-sell/10 border-trade-sell/30'
      case 'BLOCKED': return 'text-accent-warning bg-accent-warning/10 border-accent-warning/30'
      default: return 'text-text-muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-accent-success" />
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-accent-warning" />
      case 'closed': return <XCircle className="w-4 h-4 text-text-muted" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      
      <main className="ml-[260px] pt-16">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Sinais de Trading
            </h1>
            <p className="text-text-secondary mt-1">
              Sinais em tempo real baseados em Smart Money Concepts
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <select className="px-4 py-2 rounded-lg bg-bg-card border border-border-primary text-text-primary">
              <option>Todos os Ativos</option>
              <option>WIN</option>
              <option>WDO</option>
              <option>DOLFUT</option>
            </select>
            <select className="px-4 py-2 rounded-lg bg-bg-card border border-border-primary text-text-primary">
              <option>Todos os Timeframes</option>
              <option>5min</option>
              <option>15min</option>
              <option>60min</option>
            </select>
            <select className="px-4 py-2 rounded-lg bg-bg-card border border-border-primary text-text-primary">
              <option>Todos os Tipos</option>
              <option>Compra</option>
              <option>Venda</option>
            </select>
          </div>

          {/* Signals List */}
          <div className="space-y-3">
            {signals.map((signal) => (
              <div 
                key={signal.id}
                className="card flex items-center gap-4 hover:border-accent-primary/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(signal.type)}`}>
                  {signal.type === 'BUY' ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : signal.type === 'SELL' ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${signal.type === 'BUY' ? 'text-trade-buy' : signal.type === 'SELL' ? 'text-trade-sell' : 'text-accent-warning'}`}>
                      {signal.type === 'BUY' ? 'COMPRA' : signal.type === 'SELL' ? 'VENDA' : 'BLOQUEADO'}
                    </span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-secondary font-medium">{signal.asset}</span>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-muted text-sm">{signal.timeframe}</span>
                    {getStatusIcon(signal.status)}
                  </div>
                  <p className="text-sm text-text-muted mt-1">
                    {signal.confluence}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-display font-bold ${signal.score >= 70 ? 'text-accent-success' : signal.score >= 50 ? 'text-accent-warning' : 'text-accent-danger'}`}>
                    {signal.score}%
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                    <Clock className="w-3 h-3" />
                    {signal.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

