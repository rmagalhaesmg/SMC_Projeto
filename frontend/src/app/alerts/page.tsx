'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { Bell, BellOff, Trash2, Settings, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

const alerts = [
  { id: 1, type: 'success', title: 'Preço atingiu zona de liquidez', message: 'WIN alcançou a zona de liquidez em 125.800', time: '5 min atrás', read: false },
  { id: 2, type: 'warning', title: 'Bear Trap detectado', message: 'Possível armadilha de venda no ativo WDO', time: '12 min atrás', read: false },
  { id: 3, type: 'info', title: 'Confluência MTV forte', message: 'Múltiplos timeframeframes confirmando tendência de alta', time: '25 min atrás', read: true },
  { id: 4, type: 'success', title: 'Sinal de compra confirmado', message: 'Score de 78% para entrada compradores em WIN', time: '1 hora atrás', read: true },
  { id: 5, type: 'warning', title: 'Volatilidade aumentando', message: 'Expansão de volatilidade detectada no mercado', time: '2 horas atrás', read: true },
]

export default function AlertsPage() {
  const [notifications, setNotifications] = useState(alerts)
  const [filter, setFilter] = useState('all')

  const filteredAlerts = notifications.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'unread') return !alert.read
    return alert.type === filter
  })

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ))
  }

  const deleteAlert = (id: number) => {
    setNotifications(notifications.filter(alert => alert.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-accent-success" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-accent-warning" />
      case 'info': return <Info className="w-5 h-5 text-accent-primary" />
      default: return <Bell className="w-5 h-5 text-text-muted" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-accent-success'
      case 'warning': return 'border-l-accent-warning'
      case 'info': return 'border-l-accent-primary'
      default: return 'border-l-text-muted'
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      
      <main className="ml-[260px] pt-16">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">
                Alertas
              </h1>
              <p className="text-text-secondary mt-1">
                Notificações e alertas em tempo real
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border-primary text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors">
              <Settings className="w-4 h-4" />
              Configurar
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'unread', 'success', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f 
                    ? 'bg-accent-primary text-bg-primary' 
                    : 'bg-bg-card border border-border-primary text-text-secondary hover:border-accent-primary'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'unread' ? 'Não lidos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="card text-center py-12">
                <BellOff className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">Nenhum alerta encontrado</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`card border-l-4 ${getBorderColor(alert.type)} flex items-start gap-4 ${!alert.read ? 'bg-bg-card' : 'bg-bg-primary'}`}
                >
                  <div className="mt-1">
                    {getIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary">{alert.title}</h3>
                      {!alert.read && (
                        <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{alert.message}</p>
                    <p className="text-xs text-text-muted mt-2">{alert.time}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <button 
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent-primary transition-colors"
                        title="Marcar como lido"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-accent-danger transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

