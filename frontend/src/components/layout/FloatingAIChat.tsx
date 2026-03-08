import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../../api';

type Msg = { role: 'user' | 'assistant'; content: string; ts?: string };

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente IA do SMC Analysis. Analiso sinais, scores e contexto de mercado em tempo real. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    const ts = new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: msg, ts }]);
    setLoading(true);
    try {
      const res = await apiClient.post('/api/ai/chat', { pergunta: msg, ativo: 'WIN' });
      const reply = res.data?.resposta || res.data?.interpretacao || 'Sem resposta da IA';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'IA indisponível no momento. Verifique a configuração da API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 500,
          width: 360, height: 500,
          background: 'var(--bg-2)', border: '1px solid var(--border-1)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border-0)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Assistente IA</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="live-dot" style={{ width: 5, height: 5 }} />
                SMC Analysis
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: 'var(--text-3)', padding: 4 }}
              onMouseEnter={e => (e.currentTarget).style.color = 'var(--text-0)'}
              onMouseLeave={e => (e.currentTarget).style.color = 'var(--text-3)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '8px 12px', borderRadius: 8,
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-3)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-1)',
                  fontSize: 12, lineHeight: 1.5,
                  border: m.role === 'user' ? 'none' : '1px solid var(--border-0)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
                {m.ts && <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{m.ts}</div>}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border-0)', borderRadius: 8, padding: '8px 12px', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-3)', animation: `pulse-dot 1.2s ${i * 0.2}s ease infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['Último sinal?', 'Assertividade hoje?', 'Contexto WIN?'].map(q => (
              <button key={q} onClick={() => setInput(q)} style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 11,
                background: 'var(--bg-3)', border: '1px solid var(--border-1)',
                color: 'var(--text-2)', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'var(--bg-4)'; (e.currentTarget).style.color = 'var(--text-0)'; }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'var(--bg-3)'; (e.currentTarget).style.color = 'var(--text-2)'; }}
              >{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '8px 12px 12px', display: 'flex', gap: 8 }}>
            <input
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Pergunte sobre sinais, scores..."
              style={{ flex: 1, fontSize: 12 }}
            />
            <button onClick={send} disabled={loading || !input.trim()} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 500,
          width: 48, height: 48, borderRadius: '50%',
          background: open ? 'var(--bg-3)' : 'linear-gradient(135deg, var(--accent), var(--cyan))',
          border: open ? '1px solid var(--border-1)' : 'none',
          color: '#fff', boxShadow: open ? 'none' : '0 8px 24px var(--accent-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            </svg>
        }
      </button>
    </>
  );
}
