import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Preencha todos os campos'); return; }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-0)',
      display: 'flex', alignItems: 'stretch',
    }}>
      {/* Left: branding panel */}
      <div style={{
        width: '45%', flexShrink: 0,
        background: 'var(--bg-1)',
        borderRight: '1px solid var(--border-0)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '40px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(var(--border-0) 1px, transparent 1px), linear-gradient(90deg, var(--border-0) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', bottom: -100, left: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(41,98,255,0.15) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 16, color: '#fff',
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
              SMC<span style={{ color: 'var(--accent)' }}>·</span>Analysis
            </span>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 16 }}>
            PLATAFORMA INSTITUCIONAL
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 16 }}>
            Análise SMC<br />com Inteligência<br />Artificial
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Monitoramento de microestrutura de mercado, geração de sinais em tempo real e alertas inteligentes via Telegram, E-mail e WhatsApp.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '◈', label: 'Engine SMC MTV V2.3 — 5 módulos de análise' },
              { icon: '⚡', label: 'Sinais em tempo real via CSV, RTD, DLL e API' },
              { icon: '🤖', label: 'LLM integrado para interpretação contextual' },
              { icon: '🔔', label: 'Alertas instantâneos multicanal' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{f.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', fontSize: 12, color: 'var(--text-3)' }}>
          © 2025 SMC Analysis · Sistema de Monitoramento Contínuo
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Entrar na plataforma</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500, display: 'block', marginBottom: 6 }}>E-mail</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Senha</label>
                <a href="#" style={{ fontSize: 12, color: 'var(--accent)' }}>Esqueci a senha</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-3)', padding: 4,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius)',
                background: 'var(--red-dim)', border: '1px solid rgba(255,23,68,0.2)',
                fontSize: 13, color: 'var(--red)',
              }}>{error}</div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg" style={{ marginTop: 4 }}>
              {isLoading ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Entrando...</> : 'Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-3)' }}>
            Não tem conta?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Criar conta gratuita</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
