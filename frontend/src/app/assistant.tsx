import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../api';

type Msg = { role: 'user' | 'assistant'; content: string; ts: string };

const QUICK = [
  'Qual o último sinal gerado?',
  'Qual a assertividade de hoje?',
  'Explique o score HFZ atual',
  'O mercado está favorável para compra?',
  'Quais zonas institucionais estão ativas?',
  'Resumo da sessão de hoje',
];

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content: `Olá! Sou o **Assistente IA do SMC Analysis**.

Analiso os dados do mercado em tempo real usando os módulos SMC:
• **HFZ** — Microestrutura e fluxo de ordens
• **FBI** — Zonas institucionais e blocos de ordens  
• **DTM** — Validação e armadilhas
• **SDA** — Dinâmica e regime de mercado
• **MTV** — Confluência multi-timeframe

Como posso ajudar?`,
      ts: new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ativo, setAtivo] = useState('WIN');
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const ts = new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setMsgs(prev => [...prev, { role: 'user', content: msg, ts }]);
    setLoading(true);
    try {
      const res = await apiClient.post('/api/ai/chat', { pergunta: msg, ativo });
      const reply = res.data?.resposta || res.data?.interpretacao || 'IA não disponível no momento.';
      setMsgs(prev => [...prev, { role: 'assistant', content: reply, ts: new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: '❌ Erro de conexão com a IA. Verifique se a API key está configurada no backend.', ts: '—' }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearHistory = () => {
    setMsgs(prev => [prev[0]]);
    apiClient.delete('/api/ai/chat/historico').catch(() => {});
  };

  return (
    <Layout>
      <div style={{ height: 'calc(100vh - var(--topbar-h) - 48px)', display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Assistente IA</h1>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Análise contextual com LLM integrado ao engine SMC</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select className="input" value={ativo} onChange={e => setAtivo(e.target.value)} style={{ width: 90, cursor: 'pointer' }}>
              <option>WIN</option><option>WDO</option><option>NASDAQ</option>
            </select>
            <button onClick={clearHistory} className="btn btn-ghost btn-sm">Limpar chat</button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, overflowY: 'auto',
          background: 'var(--bg-2)', border: '1px solid var(--border-0)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {/* Avatar */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                background: m.role === 'assistant'
                  ? 'linear-gradient(135deg, var(--accent), var(--cyan))'
                  : 'var(--bg-4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12,
              }}>
                {m.role === 'assistant'
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" /></svg>
                  : '👤'
                }
              </div>
              <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-3)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-1)',
                  fontSize: 13, lineHeight: 1.6,
                  border: m.role === 'user' ? 'none' : '1px solid var(--border-0)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{m.ts}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="spinner" style={{ width: 12, height: 12, borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} />
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg-3)', border: '1px solid var(--border-0)', borderRadius: 10, display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-3)', animation: `pulse-dot 1.2s ${i * 0.2}s ease infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick suggestions */}
        <div style={{ padding: '10px 0', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)} style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 11,
              background: 'var(--bg-3)', border: '1px solid var(--border-1)',
              color: 'var(--text-2)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget).style.background = 'var(--bg-4)'; (e.currentTarget).style.color = 'var(--text-0)'; }}
              onMouseLeave={e => { (e.currentTarget).style.background = 'var(--bg-3)'; (e.currentTarget).style.color = 'var(--text-2)'; }}
            >{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: 8, flexShrink: 0,
          background: 'var(--bg-2)', border: '1px solid var(--border-1)',
          borderRadius: 'var(--radius-lg)', padding: '8px 8px 8px 14px',
        }}>
          <textarea
            ref={textareaRef}
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pergunte sobre sinais, scores, zonas institucionais... (Enter para enviar)"
            rows={1}
            style={{
              flex: 1, resize: 'none', border: 'none', background: 'transparent',
              padding: '4px 0', fontSize: 13, maxHeight: 120,
            }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} className="btn btn-primary" style={{ flexShrink: 0, alignSelf: 'flex-end' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
            </svg>
            Enviar
          </button>
        </div>
      </div>
    </Layout>
  );
}
