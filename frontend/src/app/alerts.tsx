import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { apiClient } from '../api';

type Channel = 'telegram' | 'email' | 'whatsapp';

export default function Alerts() {
  const [telegram, setTelegram] = useState({ chatId: '', botToken: '' });
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [testing, setTesting] = useState<Channel | null>(null);
  const [results, setResults] = useState<Record<Channel, { ok: boolean; msg: string } | null>>({ telegram: null, email: null, whatsapp: null });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const test = async (ch: Channel) => {
    setTesting(ch);
    setResults(r => ({ ...r, [ch]: null }));
    try {
      let res;
      if (ch === 'telegram') res = await apiClient.post('/api/alerts/test-telegram', { chat_id: telegram.chatId, token: telegram.botToken });
      else if (ch === 'email') res = await apiClient.post('/api/alerts/test-email', { email });
      else res = await apiClient.post('/api/alerts/test-whatsapp', { phone: whatsapp });
      setResults(r => ({ ...r, [ch]: { ok: true, msg: res.data?.message || 'Enviado com sucesso!' } }));
    } catch (e: any) {
      setResults(r => ({ ...r, [ch]: { ok: false, msg: e.response?.data?.detail || 'Erro ao enviar' } }));
    } finally {
      setTesting(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.post('/api/alerts/settings', {
        telegram_chat_id: telegram.chatId,
        telegram_token: telegram.botToken,
        email, whatsapp,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 740 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Alertas & Notificações</h1>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Configure canais de alerta para receber sinais em tempo real</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Telegram */}
          <ChannelCard
            icon={<TelegramIcon />}
            name="Telegram"
            color="var(--cyan)"
            description="Receba sinais instantaneamente no Telegram via bot personalizado"
            result={results.telegram}
            testing={testing === 'telegram'}
            canTest={!!telegram.chatId && !!telegram.botToken}
            onTest={() => test('telegram')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Chat ID</label>
                <input className="input" value={telegram.chatId} onChange={e => setTelegram(t => ({ ...t, chatId: e.target.value }))} placeholder="-100xxxxxxxxx" />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Bot Token</label>
                <input className="input" type="password" value={telegram.botToken} onChange={e => setTelegram(t => ({ ...t, botToken: e.target.value }))} placeholder="1234567890:ABCdef..." />
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-3)', borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--text-3)' }}>
              💡 Crie um bot com @BotFather, adicione ao grupo e obtenha o Chat ID via @userinfobot
            </div>
          </ChannelCard>

          {/* Email */}
          <ChannelCard
            icon={<EmailIcon />}
            name="E-mail"
            color="var(--accent)"
            description="Alertas por e-mail via SendGrid com formatação profissional"
            result={results.email}
            testing={testing === 'email'}
            canTest={!!email}
            onTest={() => test('email')}
          >
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Endereço de e-mail</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" />
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-3)', borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--text-3)' }}>
              💡 Configure SENDGRID_API_KEY no Railway para envio de e-mails
            </div>
          </ChannelCard>

          {/* WhatsApp */}
          <ChannelCard
            icon={<WhatsAppIcon />}
            name="WhatsApp"
            color="var(--green)"
            description="Alertas via WhatsApp usando Twilio API"
            result={results.whatsapp}
            testing={testing === 'whatsapp'}
            canTest={!!whatsapp}
            onTest={() => test('whatsapp')}
          >
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Número WhatsApp</label>
              <input className="input" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+5511999999999" />
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-3)', borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--text-3)' }}>
              💡 Requer TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN e TWILIO_PHONE_NUMBER configurados
            </div>
          </ChannelCard>

          {/* Alert conditions */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Condições de Disparo</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Score mínimo para alerta', type: 'number', placeholder: '55', key: 'min_score' },
                { label: 'Qualidade mínima do setup', type: 'number', placeholder: '3', key: 'min_quality' },
                { label: 'Intervalo mínimo (segundos)', type: 'number', placeholder: '60', key: 'rate_limit' },
                { label: 'Modo simulação', type: 'select', options: ['Não', 'Sim'], key: 'sim_mode' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  {f.type === 'select'
                    ? <select className="input" style={{ cursor: 'pointer' }}>
                        {f.options?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    : <input className="input" type={f.type} placeholder={f.placeholder} />
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={save} disabled={saving} className="btn btn-primary">
              {saving ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Salvando...</>
                : saved ? '✓ Salvo!'
                : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ChannelCard({ icon, name, color, description, children, result, testing, canTest, onTest }: {
  icon: React.ReactNode; name: string; color: string; description: string;
  children: React.ReactNode; result: { ok: boolean; msg: string } | null;
  testing: boolean; canTest: boolean; onTest: () => void;
}) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color,
          }}>{icon}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{description}</div>
          </div>
        </div>
        <button
          onClick={onTest}
          disabled={!canTest || testing}
          className="btn btn-ghost btn-sm"
          style={{ flexShrink: 0 }}
        >
          {testing ? <><span className="spinner" style={{ width: 10, height: 10 }} /> Testando...</> : 'Testar'}
        </button>
      </div>
      {children}
      {result && (
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 'var(--radius)',
          background: result.ok ? 'var(--green-dim)' : 'var(--red-dim)',
          border: `1px solid ${result.ok ? 'rgba(0,200,83,0.2)' : 'rgba(255,23,68,0.2)'}`,
          fontSize: 12, color: result.ok ? 'var(--green)' : 'var(--red)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {result.ok ? '✓' : '✗'} {result.msg}
        </div>
      )}
    </div>
  );
}

function TelegramIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2z" />
  </svg>;
}
function EmailIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>;
}
function WhatsAppIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>;
}
