import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SignalsTable from '../components/SignalsTable';
import { apiClient } from '../api';

export default function History() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ativo, setAtivo] = useState('');
  const [result, setResult] = useState('');
  const [direction, setDirection] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 25;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/stats/all-signals');
        setSignals(res.data?.signals || []);
      } catch {
        setSignals([]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  // Filter
  const filtered = signals.filter(s => {
    if (ativo && s.ativo !== ativo) return false;
    if (result && s.resultado !== result) return false;
    if (direction) {
      const d = s.direcao || s.type || '';
      if (direction === 'COMPRA' && !d.includes('COMPRA') && !d.includes('BUY')) return false;
      if (direction === 'VENDA' && !d.includes('VENDA') && !d.includes('SELL')) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats from filtered
  const wins = filtered.filter(s => s.resultado === 'WIN').length;
  const losses = filtered.filter(s => s.resultado === 'LOSS').length;
  const winRate = filtered.length > 0 ? (wins / (wins + losses || 1) * 100) : 0;
  const totalPoints = filtered.reduce((sum, s) => sum + (s.pontos || 0), 0);

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Histórico de Sinais</h1>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{signals.length} sinais registrados</p>
      </div>

      {/* Stats mini row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total', value: filtered.length.toString(), color: 'var(--text-1)' },
          { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, color: winRate > 50 ? 'var(--green)' : 'var(--red)' },
          { label: 'Pontos', value: `${totalPoints > 0 ? '+' : ''}${totalPoints.toFixed(1)}`, color: totalPoints > 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'W/L', value: `${wins}/${losses}`, color: 'var(--text-1)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Data inicial</label>
            <input className="input" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 150 }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Data final</label>
            <input className="input" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 150 }} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Ativo</label>
            <select className="input" value={ativo} onChange={e => setAtivo(e.target.value)} style={{ width: 100, cursor: 'pointer' }}>
              <option value="">Todos</option>
              <option>WIN</option><option>WDO</option><option>NASDAQ</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Direção</label>
            <select className="input" value={direction} onChange={e => setDirection(e.target.value)} style={{ width: 110, cursor: 'pointer' }}>
              <option value="">Todos</option>
              <option value="COMPRA">Compra</option>
              <option value="VENDA">Venda</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Resultado</label>
            <select className="input" value={result} onChange={e => setResult(e.target.value)} style={{ width: 100, cursor: 'pointer' }}>
              <option value="">Todos</option>
              <option>WIN</option><option>LOSS</option><option>OPEN</option>
            </select>
          </div>
          <button onClick={() => { setAtivo(''); setResult(''); setDirection(''); setDateFrom(''); setDateTo(''); setPage(1); }}
            className="btn btn-ghost btn-sm">Limpar</button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '16px' }}>
        <SignalsTable signals={paginated} loading={loading} maxRows={PER_PAGE} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-0)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">← Ant.</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} onClick={() => setPage(p)} className="btn btn-sm"
                    style={{ background: p === page ? 'var(--accent)' : 'var(--bg-3)', color: p === page ? '#fff' : 'var(--text-2)', border: '1px solid var(--border-1)' }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm">Próx. →</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
