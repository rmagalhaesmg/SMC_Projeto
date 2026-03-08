'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import FloatingMenu from '@/components/ui/FloatingMenu'
import Candlestick from '@/components/charts/Candlestick'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSMCWebSocket, RealtimeMessage } from '@/services/realtime'

const sample = Array.from({ length: 60 }).map((_, i) => {
  const base = 125000 + i * 5
  const open = base + Math.random() * 50 - 25
  const close = base + Math.random() * 50 - 25
  const high = Math.max(open, close) + Math.random() * 60
  const low = Math.min(open, close) - Math.random() * 60
  return { time: `T${i}`, open, high, low, close }
})

export default function ChartPage() {
  const [msg, setMsg] = useState<RealtimeMessage | null>(null)
  const search = useSearchParams()
  const replay = search.get('replay') === '1'
  const file = search.get('file') || undefined
  const symbol = search.get('symbol') || undefined
  const delay = search.get('delay') ? parseInt(search.get('delay')!, 10) : undefined
  useEffect(() => {
    const ws = createSMCWebSocket((m) => setMsg(m), replay ? { replayFile: file, symbol, delayMs: delay } : undefined)
    return () => ws.close()
  }, [replay, file, symbol, delay])
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      <FloatingMenu />
      <main className="ml-[260px] pt-16">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">Gráfico WIN</h1>
              <p className="text-text-secondary text-sm">Estilo profissional</p>
            </div>
            {msg && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-accent-primary/20 text-accent-primary text-xs">HFZ {Math.round(msg.scores.hfz * 100)}%</span>
                <span className="px-2 py-1 rounded bg-accent-warning/20 text-accent-warning text-xs">FBI {Math.round(msg.scores.fbi * 100)}%</span>
                <span className="px-2 py-1 rounded bg-accent-danger/20 text-accent-danger text-xs">DTM {Math.round(msg.scores.dtm * 100)}%</span>
                <span className="px-2 py-1 rounded bg-accent-secondary/20 text-accent-secondary text-xs">SDA {Math.round(msg.scores.sda * 100)}%</span>
                <span className="px-2 py-1 rounded bg-trade-liquidity/20 text-trade-liquidity text-xs">MTV {Math.round(msg.scores.mtv * 100)}%</span>
              </div>
            )}
          </div>
          <div className="card p-4">
            <Candlestick data={sample} liquidity={msg?.liquidity} />
          </div>
        </div>
      </main>
    </div>
  )
}
