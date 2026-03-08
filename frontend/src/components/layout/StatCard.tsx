import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  change?: string;
  changeUp?: boolean;
  color?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  sparkline?: number[];
}

export default function StatCard({ title, value, sub, change, changeUp, color = 'var(--accent)', loading, icon, sparkline }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border-0)',
      borderRadius: 'var(--radius-lg)', padding: '16px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget).style.borderColor = 'var(--border-2)'}
      onMouseLeave={e => (e.currentTarget).style.borderColor = 'var(--border-0)'}
    >
      {/* Accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{title}</span>
        {icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius)',
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
          }}>
            {icon}
          </div>
        )}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 28, width: '60%' }} />
      ) : (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </div>
      )}

      {/* Sparkline mini-chart */}
      {sparkline && sparkline.length > 1 && (
        <MiniSparkline data={sparkline} color={color} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }}>
        {sub && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</span>}
        {change && (
          <span style={{
            fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
            color: changeUp ? 'var(--green)' : 'var(--red)',
          }}>
            {changeUp ? '▲' : '▼'} {change}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const h = 32, w = 100;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}
