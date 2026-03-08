import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const MONTHLY = [
  { m: 'Set', signals: 132, wr: 61.2, pts: 218 },
  { m: 'Out', signals: 145, wr: 58.9, pts: 187 },
  { m: 'Nov', signals: 138, wr: 65.5, pts: 275 },
  { m: 'Dez', signals: 152, wr: 63.1, pts: 241 },
  { m: 'Jan', signals: 141, wr: 67.0, pts: 312 },
  { m: 'Fev', signals: 156, wr: 63.7, pts: 288 },
];

const MODULE_DATA = [
  { name: 'HFZ', assertividade: 74, sinais: 156 },
  { name: 'FBI', assertividade: 68, sinais: 143 },
  { name: 'DTM', assertividade: 71, sinais: 128 },
  { name: 'SDA', assertividade: 65, sinais: 156 },
  { name: 'MTV', assertividade: 78, sinais: 98 },
];

const PERIOD_DATA = [
  { name: 'WIN', value: 52 }, { name: 'LOSS', value: 30 }, { name: 'OPEN', value: 18 },
];
const PIE_COLORS = ['var(--green)', 'var(--red)', 'var(--accent)'];

export default function Reports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true);
    setTimeout(() => {
      const data = MONTHLY;
      const content = format === 'csv'
        ? ['Mês,Sinais,Win Rate,Pontos', ...data.map(d => `${d.m},${d.signals},${d.wr}%,${d.pts}`)].join('\n')
        : JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `smc_report.${format}`; a.click();
      setExporting(false);
    }, 500);
  };

  return (
    <Layout>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Relatórios & Analytics</h1>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Performance histórica e análise de módulos SMC</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['week', 'month', 'quarter'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className="btn btn-sm"
                style={{
                  background: period === p ? 'var(--accent)' : 'var(--bg-3)',
                  color: period === p ? '#fff' : 'var(--text-2)',
                  border: `1px solid ${period === p ? 'var(--accent)' : 'var(--border-1)'}`,
                }}>
                {p === 'week' ? '7D' : p === 'month' ? '1M' : '3M'}
              </button>
            ))}
            <button onClick={() => handleExport('csv')} disabled={exporting} className="btn btn-ghost btn-sm">
              {exporting ? <span className="spinner" style={{ width: 10, height: 10 }} /> : '↓'} CSV
            </button>
            <button onClick={() => handleExport('json')} disabled={exporting} className="btn btn-ghost btn-sm">
              ↓ JSON
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Sinais', value: '156', sub: 'Fevereiro 2025', color: 'var(--accent)' },
            { label: 'Assertividade', value: '63.7%', sub: '↑ 2.1% vs jan', color: 'var(--green)' },
            { label: 'Pontos Total', value: '+287.5', sub: 'WIN equivalente', color: 'var(--cyan)' },
            { label: 'Maior Streak', value: '12', sub: '5 atual', color: 'var(--yellow)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: '14px 16px', borderTop: `2px solid ${k.color}` }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {/* Monthly signals & WR */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Sinais e Assertividade Mensal</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MONTHLY}>
                <XAxis dataKey="m" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[50, 80]} />
                <Tooltip contentStyle={{ background: 'var(--bg-4)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar yAxisId="left" dataKey="signals" fill="var(--accent)" radius={[3, 3, 0, 0]} opacity={0.7} />
                <Line yAxisId="right" type="monotone" dataKey="wr" stroke="var(--green)" strokeWidth={2} dot={{ fill: 'var(--green)', r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution pie */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Distribuição de Resultados</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={PERIOD_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {PERIOD_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-4)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PERIOD_DATA.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{d.name}</span>
                    </div>
                    <div style={{ display: 'flex', align: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: PIE_COLORS[i] }}>{d.value}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{(d.value / PERIOD_DATA.reduce((a, b) => a + b.value, 0) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module analysis */}
        <div className="card" style={{ padding: '16px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Performance por Módulo SMC</div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Módulo</th>
                  <th>Assertividade</th>
                  <th>Sinais</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {MODULE_DATA.map(m => (
                  <tr key={m.name}>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{m.name}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: m.assertividade > 70 ? 'var(--green)' : 'var(--yellow)', minWidth: 36 }}>{m.assertividade}%</span>
                        <div className="score-bar" style={{ width: 80 }}>
                          <div className="score-bar-fill" style={{ width: `${m.assertividade}%`, background: m.assertividade > 70 ? 'var(--green)' : 'var(--yellow)' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{m.sinais}</td>
                    <td>
                      <span className={`badge badge-${m.assertividade > 70 ? 'green' : 'yellow'}`}>
                        {m.assertividade > 70 ? 'Excelente' : 'Bom'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Points timeline */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Evolução de Pontos — 6 Meses</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={MONTHLY}>
              <XAxis dataKey="m" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-4)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }} />
              <Line type="monotone" dataKey="pts" stroke="var(--cyan)" strokeWidth={2} dot={{ fill: 'var(--cyan)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
