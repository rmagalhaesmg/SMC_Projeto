import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import SignalsTable from '../components/SignalsTable';
import { apiClient } from '../api';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const MOCK_STATS = { total_signals: 156, win_rate: 63.7, total_points: 287.5, avg_score: 71.2 };
const MOCK_POINTS = Array.from({ length: 24 }, (_, i) => ({ t: `${i}h`, v: Math.round(50 + Math.random() * 200 - i * 2) }));
const MOCK_ACCURACY = [
  { name: 'HFZ', val: 74 }, { name: 'FBI', val: 68 }, { name: 'DTM', val: 71 },
  { name: 'SDA', val: 65 }, { name: 'MTV', val: 78 }
];

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [signal, setSignal] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, signalRes, signalsRes] = await Promise.allSettled([
        apiClient.get('/analysis/stats'),
        apiClient.get('/api/ultimo-sinal/WIN'),
        apiClient.get('/stats/all-signals'),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (signalRes.status === 'fulfilled') setSignal(signalRes.value.data);
      if (signalsRes.status === 'fulfilled') setSignals(signalsRes.value.data?.signals || []);
      setLastUpdate(new Date());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchData();
    if (!autoRefresh) return;
    const t = setInterval(fetchData, 10000);
    return () => clearInterval(t);
  }, [fetchData, autoRefresh]);

  const s = stats || MOCK_STATS;
  const score = signal?.score_final ?? 0;
  const dir = signal?.direcao ?? 'AGUARDANDO';
  const scoreColor = score >= 70 ? 'var(--green)' : score >= 55 ? 'var(--yellow)' : 'var(--text-3)';
  const isUp = dir?.includes('COMPRA') || dir?.includes('BUY');
  const isDown = dir?.includes('VENDA') || dir?.includes('SELL');

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-0)' }}>
            Dashboard
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            Dados ao vivo — WIN · {lastUpdate.toLocaleTimeString('pt-BR', { hour12: false })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn btn-sm btn-ghost`}
            style={{ color: autoRefresh ? 'var(--green)' : 'var(--text-3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </button>
          <button onClick={fetchData} className="btn btn-sm btn-ghost">
            Atualizar
          </button>
        </div>
      </div>

      {/* Live signal banner */}
      {signal && !signal.aquecendo && (
        <div style={{
          background: 'var(--bg-2)', border: `1px solid ${isUp ? 'rgba(0,200,83,0.3)' : isDown ? 'rgba(255,23,68,0.3)' : 'var(--border-0)'}`,
          borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 20,
          borderLeft: `3px solid ${isUp ? 'var(--green)' : isDown ? 'var(--red)' : 'var(--text-3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.08em' }}>SINAL ATUAL</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: isUp ? 'var(--green)' : isDown ? 'var(--red)' : 'var(--text-2)' }}>
            {isUp ? '▲' : isDown ? '▼' : '—'} {dir}
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Stat label="Score" value={`${score.toFixed(1)}`} color={scoreColor} />
            <Stat label="Qualidade" value={`${signal.qualidade_setup || 0}/5`} color="var(--text-1)" />
            <Stat label="Regime" value={signal.regime_mercado || signal.estado_mercado || '—'} color="var(--text-1)" />
            <Stat label="Risco" value={signal.risco_contextual || '—'} color="var(--yellow)" />
          </div>
          {signal.permissao_compra && <span className="badge badge-green">COMPRA LIBERADA</span>}
          {signal.permissao_venda && <span className="badge badge-red">VENDA LIBERADA</span>}
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard
          title="Total de Sinais" value={s.total_signals ?? '—'} loading={loading}
          sub="últimos 30 dias" color="var(--accent)"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /></svg>}
        />
        <StatCard
          title="Assertividade" value={`${(s.win_rate ?? 0).toFixed(1)}%`} loading={loading}
          sub="win/loss ratio" color="var(--green)"
          change={`${(s.win_rate ?? 0) > 60 ? '+' : ''}${((s.win_rate ?? 0) - 50).toFixed(1)}%`}
          changeUp={(s.win_rate ?? 0) > 50}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12" /></svg>}
        />
        <StatCard
          title="Pontos Acum." value={`${(s.total_points ?? 0) > 0 ? '+' : ''}${(s.total_points ?? 0).toFixed(1)}`} loading={loading}
          sub="WIN equiv." color="var(--cyan)"
          change="vs mês ant." changeUp={(s.total_points ?? 0) > 0}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></svg>}
        />
        <StatCard
          title="Score Médio" value={`${(s.avg_score ?? 0).toFixed(1)}`} loading={loading}
          sub="todos os módulos" color="var(--orange)"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Points chart */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Evolução de Pontos</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Acumulado intraday</div>
            </div>
            <span className="badge badge-cyan">HOY</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={MOCK_POINTS}>
              <defs>
                <linearGradient id="ptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-4)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-2)' }}
                itemStyle={{ color: 'var(--cyan)' }}
              />
              <ReferenceLine y={0} stroke="var(--border-1)" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="v" stroke="var(--cyan)" strokeWidth={1.5} fill="url(#ptGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Module accuracy */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Assertividade por Módulo</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>HFZ · FBI · DTM · SDA · MTV</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MOCK_ACCURACY} barSize={24}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} width={28} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-4)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                formatter={(v: any) => [`${v}%`, 'Assertividade']}
              />
              <Bar dataKey="val" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SMC Scores (when signal available) */}
      {signal && !signal.aquecendo && (
        <div className="card" style={{ padding: '16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', marginBottom: 14 }}>Scores SMC em Tempo Real</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { key: 'score_hfz', label: 'HFZ', desc: 'Microestrutura' },
              { key: 'score_fbi', label: 'FBI', desc: 'Zonas Inst.' },
              { key: 'score_dtm', label: 'DTM', desc: 'Validação' },
              { key: 'score_sda', label: 'SDA', desc: 'Dinâmica' },
              { key: 'score_mtv', label: 'MTV', desc: 'Multi-TF' },
            ].map(m => {
              const val = signal[m.key] ?? 0;
              const c = val >= 70 ? 'var(--green)' : val >= 55 ? 'var(--yellow)' : val >= 40 ? 'var(--orange)' : 'var(--red)';
              return (
                <div key={m.key} style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border-0)',
                  borderRadius: 'var(--radius)', padding: '12px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: c, margin: '6px 0' }}>{val.toFixed(0)}</div>
                  <div className="score-bar"><div className="score-bar-fill" style={{ width: `${val}%`, background: c }} /></div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>{m.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Signals table */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Últimos Sinais</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{signals.length} registros</div>
          </div>
          <a href="/history" style={{ fontSize: 12, color: 'var(--accent)' }}>Ver histórico completo →</a>
        </div>
        <SignalsTable signals={signals} loading={loading} maxRows={10} />
      </div>
    </Layout>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
