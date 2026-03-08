import React, { useState } from 'react';
import Layout from '../components/Layout';
import { apiClient } from '../api';

const PLANS = [
  {
    id: 'mensal', name: 'Mensal', price: 'R$ 97', period: '/mês', color: 'var(--accent)',
    features: ['Sinais em tempo real', 'Alertas Telegram + Email', 'Assistente IA', 'Histórico 30 dias', 'Suporte via e-mail'],
  },
  {
    id: 'semestral', name: 'Semestral', price: 'R$ 67', period: '/mês', badge: 'POPULAR', color: 'var(--cyan)',
    features: ['Tudo do plano Mensal', 'Alertas WhatsApp', 'Histórico ilimitado', 'Relatórios avançados', 'Suporte prioritário'],
  },
  {
    id: 'anual', name: 'Anual', price: 'R$ 47', period: '/mês', badge: 'MELHOR CUSTO', color: 'var(--green)',
    features: ['Tudo do plano Semestral', 'API key pessoal', 'Acesso antecipado a novas features', 'Suporte 24/7 via WhatsApp', 'Onboarding personalizado'],
  },
];

export default function Billing() {
  const [loading, setLoading] = useState<string | null>(null);
  const [gateway, setGateway] = useState<'stripe' | 'mp'>('stripe');

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await apiClient.post(`/billing/checkout/${gateway === 'stripe' ? 'stripe' : 'mercadopago'}`, { plan: planId });
      const url = res.data?.url || res.data?.checkout_url;
      if (url) window.open(url, '_blank');
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Erro ao criar checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 900 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Planos e Assinatura</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>Acesse análises institucionais de microestrutura com IA integrada</p>
        </div>

        {/* Gateway selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', alignSelf: 'center' }}>Pagamento via:</span>
          {(['stripe', 'mp'] as const).map(g => (
            <button key={g} onClick={() => setGateway(g)} className="btn btn-sm"
              style={{
                background: gateway === g ? 'var(--bg-4)' : 'var(--bg-3)',
                border: `1px solid ${gateway === g ? 'var(--border-2)' : 'var(--border-1)'}`,
                color: gateway === g ? 'var(--text-0)' : 'var(--text-3)',
              }}>
              {g === 'stripe' ? '💳 Stripe' : '🟢 Mercado Pago'}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              background: 'var(--bg-2)', border: `1px solid ${p.badge === 'POPULAR' ? p.color : 'var(--border-0)'}`,
              borderRadius: 'var(--radius-lg)', padding: '24px',
              position: 'relative', overflow: 'hidden',
              boxShadow: p.badge === 'POPULAR' ? `0 0 30px ${p.color}20` : 'none',
            }}>
              {p.badge && (
                <div style={{
                  position: 'absolute', top: 16, right: -20, transform: 'rotate(45deg)',
                  background: p.color, color: '#fff', fontSize: 9, fontWeight: 700,
                  padding: '3px 32px', letterSpacing: '0.08em',
                }}>{p.badge}</div>
              )}
              <div style={{ height: 3, background: p.color, margin: '-24px -24px 20px', borderRadius: '6px 6px 0 0' }} />
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: p.color }}>{p.price}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)', paddingBottom: 4 }}>{p.period}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border-0)', margin: '16px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-2)' }}>
                    <span style={{ color: p.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCheckout(p.id)}
                disabled={!!loading}
                className="btn btn-lg"
                style={{
                  width: '100%', justifyContent: 'center',
                  background: p.badge === 'POPULAR' ? p.color : 'var(--bg-3)',
                  color: p.badge === 'POPULAR' ? '#fff' : 'var(--text-1)',
                  border: p.badge === 'POPULAR' ? 'none' : `1px solid var(--border-1)`,
                }}
              >
                {loading === p.id ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Aguarde...</> : `Assinar ${p.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Current status */}
        <div className="card" style={{ padding: '20px', marginTop: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Sua Assinatura Atual</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Status</div>
                <span className="badge badge-green" style={{ marginTop: 4 }}>Ativo</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Plano</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-1)', marginTop: 4 }}>Mensal</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Próxima cobrança</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-1)', marginTop: 4 }}>08/04/2025</div>
              </div>
            </div>
            <button className="btn btn-danger btn-sm">Cancelar assinatura</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
