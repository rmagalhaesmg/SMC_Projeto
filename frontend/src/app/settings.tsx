import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

type Tab = 'profile' | 'engine' | 'security' | 'system';

export default function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState('');

  const save = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(''), 2000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'engine', label: 'Engine SMC', icon: '⚙' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'system', label: 'Sistema', icon: '🖥' },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 780 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Configurações</h1>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Personalize o sistema SMC Analysis</p>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 24, borderBottom: '1px solid var(--border-0)', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', fontSize: 12, fontWeight: 500,
              color: tab === t.id ? 'var(--text-0)' : 'var(--text-3)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {tab === 'profile' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Informações do Perfil</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-0)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: '#fff',
              }}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{user?.email?.split('@')[0]}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{user?.email}</div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Alterar foto</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormField label="Nome" defaultValue={user?.email?.split('@')[0]} placeholder="Seu nome" />
              <FormField label="E-mail" defaultValue={user?.email} placeholder="email@exemplo.com" type="email" />
              <FormField label="Telefone" placeholder="+55 11 99999-9999" type="tel" />
              <FormField label="Fuso horário" type="select" options={['America/Sao_Paulo', 'America/New_York', 'Europe/London']} />
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => save('profile')} className="btn btn-primary">
                {saved === 'profile' ? '✓ Salvo!' : 'Salvar perfil'}
              </button>
            </div>
          </div>
        )}

        {/* ENGINE */}
        {tab === 'engine' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Parâmetros do Engine SMC</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Tipo de Ativo" type="select" options={['WIN (Mini-índice)', 'WDO (Mini-dólar)', 'NASDAQ', 'ES (S&P 500)', 'Forex', 'Cripto']} />
                <FormField label="Timeframe Base (min)" type="select" options={['1', '3', '5', '10', '15', '30', '60']} defaultValue="5" />
                <FormField label="Modo de Operação" type="select" options={['1 — Conservador', '2 — Normal', '3 — Agressivo']} defaultValue="2 — Normal" />
                <FormField label="Score Mínimo para Alerta" type="number" defaultValue="55" placeholder="55" />
                <FormField label="Qualidade Mínima Setup" type="select" options={['1', '2', '3', '4', '5']} defaultValue="3" />
                <FormField label="Tick Mínimo" type="number" defaultValue="5" placeholder="5" />
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>API Keys — Integração IA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>OpenAI API Key</label>
                  <input className="input" type="password" placeholder="sk-..." />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Gemini API Key</label>
                  <input className="input" type="password" placeholder="AIza..." />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Modelo LLM</label>
                  <select className="input" style={{ cursor: 'pointer' }}>
                    <option>gpt-4</option><option>gpt-4-turbo</option><option>gpt-3.5-turbo</option><option>gemini-pro</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => save('engine')} className="btn btn-primary">
                {saved === 'engine' ? '✓ Salvo!' : 'Salvar configurações'}
              </button>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {tab === 'security' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Segurança da Conta</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Senha atual</label>
                <input className="input" type="password" placeholder="••••••••" style={{ maxWidth: 400 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Nova senha</label>
                <input className="input" type="password" placeholder="Mínimo 8 caracteres" style={{ maxWidth: 400 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Confirmar nova senha</label>
                <input className="input" type="password" placeholder="Repita a nova senha" style={{ maxWidth: 400 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: 400 }}>
                <button onClick={() => save('security')} className="btn btn-primary">
                  {saved === 'security' ? '✓ Alterada!' : 'Alterar senha'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM */}
        {tab === 'system' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Informações do Sistema</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Versão do Engine', 'SMC MTV V2.3'],
                  ['Backend URL', process.env.REACT_APP_API_URL || 'Não configurado'],
                  ['WebSocket', 'ws://...'],
                  ['Banco de dados', 'PostgreSQL (Railway)'],
                  ['Status', '🟢 Online'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-0)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-3)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function FormField({ label, defaultValue, placeholder, type = 'text', options }: {
  label: string; defaultValue?: string; placeholder?: string; type?: string; options?: string[];
}) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>{label}</label>
      {type === 'select'
        ? <select className="input" defaultValue={defaultValue} style={{ cursor: 'pointer' }}>
            {options?.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input className="input" type={type} defaultValue={defaultValue} placeholder={placeholder} />
      }
    </div>
  );
}
