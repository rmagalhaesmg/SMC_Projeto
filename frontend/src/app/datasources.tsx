import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../api';

type Tab = 'status' | 'csv' | 'rtd' | 'dll' | 'api';

const SOURCES = [
  { name: 'CSV / Profit Chart', status: 'active' as const, latency: '—', lastUpdate: '10:42', desc: 'Upload manual ou automático de arquivos CSV' },
  { name: 'RTD (Excel)', status: 'active' as const, latency: '120ms', lastUpdate: '10:43', desc: 'Real-Time Data via Excel/DDE' },
  { name: 'DLL Neológica', status: 'offline' as const, latency: '—', lastUpdate: '—', desc: 'Integração direta via biblioteca DLL' },
  { name: 'API REST', status: 'active' as const, latency: '85ms', lastUpdate: '10:43', desc: 'Endpoint POST /api/processar-barra' },
  { name: 'WebSocket', status: 'delayed' as const, latency: '240ms', lastUpdate: '10:41', desc: 'Feed em tempo real via WS' },
];

export default function DataSources() {
  const [tab, setTab] = useState<Tab>('status');
  const [file, setFile] = useState<File | null>(null);
  const [csvType, setCsvType] = useState<'trades' | 'book' | 'volume'>('trades');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx'))) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setUploadResult(null);
    const form = new FormData();
    form.append('file', file);
    form.append('type', csvType);
    try {
      const res = await apiClient.post('/ingestion/upload-csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadResult({ ok: true, msg: `${res.data?.records_processed || 0} registros processados com sucesso` });
    } catch (e: any) {
      setUploadResult({ ok: false, msg: e.response?.data?.detail || 'Erro no upload' });
    } finally {
      setUploading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'status', label: 'Status Geral' },
    { id: 'csv', label: 'CSV Upload' },
    { id: 'rtd', label: 'RTD / Excel' },
    { id: 'dll', label: 'DLL' },
    { id: 'api', label: 'API / WebSocket' },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Fontes de Dados</h1>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Conecte e gerencie todas as fontes de dados para análise em tempo real</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border-0)', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 500,
              color: tab === t.id ? 'var(--text-0)' : 'var(--text-3)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (tab !== t.id) (e.currentTarget).style.color = 'var(--text-1)'; }}
              onMouseLeave={e => { if (tab !== t.id) (e.currentTarget).style.color = 'var(--text-3)'; }}
            >{t.label}</button>
          ))}
        </div>

        {/* STATUS TAB */}
        {tab === 'status' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SOURCES.map(s => (
              <div key={s.name} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: s.status === 'active' ? 'var(--green)' : s.status === 'delayed' ? 'var(--yellow)' : 'var(--text-3)',
                  boxShadow: s.status === 'active' ? '0 0 6px var(--green)' : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.desc}</div>
                </div>
                <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
                  <InfoPill label="Status" value={s.status === 'active' ? 'Online' : s.status === 'delayed' ? 'Lento' : 'Offline'}
                    color={s.status === 'active' ? 'var(--green)' : s.status === 'delayed' ? 'var(--yellow)' : 'var(--text-3)'} />
                  <InfoPill label="Latência" value={s.latency} color="var(--text-2)" />
                  <InfoPill label="Últ. Update" value={s.lastUpdate} color="var(--text-2)" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CSV TAB */}
        {tab === 'csv' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 13 }}>Upload de Arquivo</div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 8 }}>Tipo de dados</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['trades', 'book', 'volume'] as const).map(t => (
                    <button key={t} onClick={() => setCsvType(t)} style={{
                      padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 500,
                      background: csvType === t ? 'var(--accent)' : 'var(--bg-3)',
                      color: csvType === t ? '#fff' : 'var(--text-2)',
                      border: `1px solid ${csvType === t ? 'var(--accent)' : 'var(--border-1)'}`,
                      transition: 'all 0.15s',
                    }}>
                      {t === 'trades' ? 'Negócios' : t === 'book' ? 'Book' : 'Volume'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : file ? 'var(--green)' : 'var(--border-1)'}`,
                  borderRadius: 'var(--radius-lg)', padding: '40px 20px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'var(--accent-dim)' : file ? 'var(--green-dim)' : 'var(--bg-3)',
                  transition: 'all 0.2s',
                }}
              >
                <input ref={fileRef} type="file" accept=".csv,.xlsx" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setUploadResult(null); } }} />
                <div style={{ marginBottom: 8 }}>
                  {file
                    ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" style={{ margin: '0 auto' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
                    : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" style={{ margin: '0 auto' }}><polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                  }
                </div>
                <div style={{ fontSize: 13, color: file ? 'var(--green)' : 'var(--text-2)' }}>
                  {file ? file.name : 'Arraste um arquivo CSV ou clique para selecionar'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Suporta .csv e .xlsx · Máx 100MB'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
                {file && <button onClick={() => { setFile(null); setUploadResult(null); }} className="btn btn-ghost btn-sm">Cancelar</button>}
                <button onClick={handleUpload} disabled={!file || uploading} className="btn btn-primary">
                  {uploading ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Processando...</> : 'Enviar e Processar'}
                </button>
              </div>

              {uploadResult && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius)',
                  background: uploadResult.ok ? 'var(--green-dim)' : 'var(--red-dim)',
                  border: `1px solid ${uploadResult.ok ? 'rgba(0,200,83,0.2)' : 'rgba(255,23,68,0.2)'}`,
                  fontSize: 13, color: uploadResult.ok ? 'var(--green)' : 'var(--red)',
                }}>
                  {uploadResult.ok ? '✓' : '✗'} {uploadResult.msg}
                </div>
              )}
            </div>

            {/* CSV format reference */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>Formato Esperado</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', background: 'var(--bg-3)', padding: '12px 16px', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
                open,high,low,close,volume,volume_compra,volume_venda,trades,true_range,timestamp_hhmm<br />
                131450,131480,131420,131460,1250,680,570,420,60,1042
              </div>
            </div>
          </div>
        )}

        {/* RTD TAB */}
        {tab === 'rtd' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Integração RTD / Excel</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 20 }}>
              O RTD (Real-Time Data) permite que o Excel conecte ao backend e envie dados de candles em tempo real automaticamente.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['URL do endpoint', `${process.env.REACT_APP_API_URL}/api/processar-barra`],
                ['Método', 'POST'],
                ['Content-Type', 'application/json'],
                ['Authorization', 'Bearer <seu_token>'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', width: 140, flexShrink: 0 }}>{k}</span>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', background: 'var(--bg-3)', padding: '3px 8px', borderRadius: 4 }}>{v}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DLL TAB */}
        {tab === 'dll' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Integração DLL Neológica</div>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              Integração via biblioteca nativa Neológica (Windows DLL). Consulte a documentação NEOLOGICA_INTEGRATION.py no repositório.
            </p>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--yellow-dim)', border: '1px solid rgba(255,214,0,0.2)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--yellow)' }}>
              ⚠ Requer sistema Windows com Neológica instalado e configurado
            </div>
          </div>
        )}

        {/* API TAB */}
        {tab === 'api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14 }}>REST API — Processar Barra</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', background: 'var(--bg-3)', padding: '14px 16px', borderRadius: 'var(--radius)', overflowX: 'auto', lineHeight: 1.8 }}>
                <span style={{ color: 'var(--green)' }}>POST</span> /api/processar-barra<br /><br />
                {'{'}<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"open"</span>: 131450,<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"high"</span>: 131480,<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"low"</span>: 131420,<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"close"</span>: 131460,<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"volume"</span>: 1250,<br />
                &nbsp;&nbsp;<span style={{ color: 'var(--cyan)' }}>"ativo"</span>: <span style={{ color: 'var(--yellow)' }}>"WIN"</span><br />
                {'}'}
              </div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14 }}>WebSocket — Feed Tempo Real</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', background: 'var(--bg-3)', padding: '14px 16px', borderRadius: 'var(--radius)', lineHeight: 1.8 }}>
                ws://<span style={{ color: 'var(--cyan)' }}>seu-backend.railway.app</span>/ws/signals
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color }}>{value}</div>
    </div>
  );
}
