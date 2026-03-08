import React from 'react';

export interface Signal {
  id?: string | number;
  timestamp?: string;
  ativo?: string;
  type?: string;
  direcao?: string;
  score?: number;
  score_final?: number;
  estado_mercado?: string;
  qualidade_setup?: number;
  resultado?: 'WIN' | 'LOSS' | 'OPEN' | null;
  pontos?: number;
  preco?: number;
}

interface Props {
  signals: Signal[];
  loading?: boolean;
  maxRows?: number;
  showPagination?: boolean;
}

export default function SignalsTable({ signals, loading, maxRows = 20 }: Props) {
  const rows = signals.slice(0, maxRows);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 40 }} />
        ))}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-3)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.4 }}>
          <path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" />
        </svg>
        <div style={{ fontSize: 13 }}>Nenhum sinal disponível</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Aguardando dados do mercado...</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Ativo</th>
            <th>Direção</th>
            <th>Score</th>
            <th>Qualidade</th>
            <th>Regime</th>
            <th>Resultado</th>
            <th>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => {
            const dir = s.direcao || s.type || 'NEUTRO';
            const score = s.score_final ?? s.score ?? 0;
            const isUp = dir.includes('COMPRA') || dir.includes('BUY') || dir === 'LONG';
            const isDown = dir.includes('VENDA') || dir.includes('SELL') || dir === 'SHORT';
            const dirColor = isUp ? 'var(--green)' : isDown ? 'var(--red)' : 'var(--text-2)';
            const scoreColor = score >= 70 ? 'var(--green)' : score >= 55 ? 'var(--yellow)' : 'var(--text-2)';

            return (
              <tr key={s.id ?? i}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>
                  {s.timestamp ? new Date(s.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12 }}>
                    {s.ativo || 'WIN'}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '2px 8px', borderRadius: 3,
                    background: isUp ? 'var(--green-dim)' : isDown ? 'var(--red-dim)' : 'var(--bg-4)',
                    color: dirColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  }}>
                    {isUp ? '▲' : isDown ? '▼' : '—'} {dir}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: scoreColor, minWidth: 36 }}>
                      {score.toFixed(1)}
                    </span>
                    <div className="score-bar" style={{ width: 48 }}>
                      <div className="score-bar-fill" style={{ width: `${score}%`, background: scoreColor }} />
                    </div>
                  </div>
                </td>
                <td>
                  <QualityDots value={s.qualidade_setup ?? 0} />
                </td>
                <td style={{ fontSize: 12, color: 'var(--text-2)' }}>
                  {s.estado_mercado || '—'}
                </td>
                <td>
                  {s.resultado ? (
                    <span className={`badge badge-${s.resultado === 'WIN' ? 'green' : s.resultado === 'LOSS' ? 'red' : 'blue'}`}>
                      {s.resultado}
                    </span>
                  ) : <span style={{ color: 'var(--text-3)' }}>—</span>}
                </td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                    color: (s.pontos ?? 0) > 0 ? 'var(--green)' : (s.pontos ?? 0) < 0 ? 'var(--red)' : 'var(--text-3)',
                  }}>
                    {s.pontos !== undefined ? `${s.pontos > 0 ? '+' : ''}${s.pontos}` : '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function QualityDots({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i <= value ? 'var(--accent)' : 'var(--bg-4)',
          border: `1px solid ${i <= value ? 'var(--accent)' : 'var(--border-1)'}`,
        }} />
      ))}
    </div>
  );
}
