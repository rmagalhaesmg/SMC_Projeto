'use client'

import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, ReferenceLine } from 'recharts'
import React from 'react'

type Candle = { time: string; open: number; high: number; low: number; close: number; volume?: number }
type Liquidity = { price: number; strength: number; side: 'bid'|'ask'|'mid' }

function CandleBar({ x, y, width, height, fill }: any) {
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} />
}

export default function Candlestick({ data, liquidity }: { data: Candle[]; liquidity?: Liquidity[] }) {
  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="time" tick={{ fill: 'hsl(var(--text-secondary))', fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fill: 'hsl(var(--text-secondary))', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--bg-tertiary))', border: '1px solid hsl(var(--border))' }}
            labelStyle={{ color: 'hsl(var(--text-primary))' }}
          />
          {liquidity?.map((z, i) => (
            <ReferenceLine
              key={i}
              y={z.price}
              stroke={z.side === 'bid' ? 'hsl(var(--trade-buy))' : z.side === 'ask' ? 'hsl(var(--trade-sell))' : 'hsl(var(--accent-primary))'}
              strokeOpacity={0.25 + Math.min(0.65, z.strength)}
              strokeWidth={2}
              ifOverflow="extendDomain"
            />
          ))}
          <Bar
            dataKey="close"
            shape={(props: any) => {
              const d = props.payload as Candle
              const up = d.close >= d.open
              const top = Math.min(d.open, d.close)
              const bottom = Math.max(d.open, d.close)
              const bodyHeight = Math.max(2, Math.abs(props.yScale(bottom) - props.yScale(top)))
              const wickTop = props.yScale(d.high)
              const wickBottom = props.yScale(d.low)
              const cx = props.x + props.width / 2
              const color = up ? 'hsl(var(--trade-buy))' : 'hsl(var(--trade-sell))'
              return (
                <g>
                  <line x1={cx} x2={cx} y1={wickTop} y2={wickBottom} stroke={color} strokeWidth={2} />
                  <CandleBar x={props.x + 1} y={props.yScale(top)} width={props.width - 2} height={bodyHeight} fill={color} />
                </g>
              )
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
