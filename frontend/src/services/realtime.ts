export type RealtimeMessage = {
  symbol: string
  price: number
  scores: {
    hfz: number
    fbi: number
    dtm: number
    sda: number
    mtv: number
    final: number
    direction: string
    estado_mercado: number
    qualidade_setup: number
    eventos: string[]
  }
  liquidity?: { price: number; strength: number; side: 'bid'|'ask'|'mid' }[]
  timestamp: string
}

export function createSMCWebSocket(
  onMessage: (msg: RealtimeMessage) => void,
  opts?: { replayFile?: string; symbol?: string; delayMs?: number }
) {
  const base = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
  const wsPath = opts?.replayFile
    ? `${base}/api/market/ws-replay?file=${encodeURIComponent(opts.replayFile)}${
        opts?.symbol ? `&symbol=${encodeURIComponent(opts.symbol)}` : ''
      }${opts?.delayMs ? `&delay=${opts.delayMs / 1000}` : ''}`
    : `${base}/api/market/ws`
  const ws = new WebSocket(wsPath)
  ws.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data)
      onMessage(data)
    } catch {}
  }
  return ws
}
