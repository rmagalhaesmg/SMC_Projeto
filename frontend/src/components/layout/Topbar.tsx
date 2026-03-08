import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BACKEND = process.env.REACT_APP_API_URL || 'https://smcanalisys-production-4d47.up.railway.app';

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState<'open' | 'pre' | 'closed'>('open');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const mins = h * 60 + m;
    if (mins >= 540 && mins < 1020) setMarketStatus('open');
    else if (mins >= 480 && mins < 540) setMarketStatus('pre');
    else setMarketStatus('closed');
  }, [time]);

  const statusColors = { open: 'var(--green)', pre: 'var(--yellow)', closed: 'var(--text-3)' };
  const statusLabels = { open: 'MERCADO ABERTO', pre: 'PRÉ-ABERTURA', closed: 'FECHADO' };

  const isNotDashboard = location.pathname !== '/dashboard' && location.pathname !== '/';

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--topbar-h)',
      background: 'var(--bg-0)',
      borderBottom: '1px solid var(--border-0)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px',
      gap: '12px',
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: '#fff',
        }}>S</div>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-0)' }}>
          SMC<span style={{ color: 'var(--accent)', marginLeft: 1 }}>·</span>Analysis
        </span>
      </Link>

      {/* Back button */}
      {isNotDashboard && (
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 'var(--radius)',
            background: 'var(--bg-3)', border: '1px solid var(--border-1)',
            color: 'var(--text-2)', fontSize: 12, fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.color = 'var(--text-0)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.color = 'var(--text-2)'; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar
        </button>
      )}

      {/* Center: market ticker */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <TickerItem label="WIN" value="131.450" change="+0.32%" up />
        <TickerItem label="WDO" value="5.842" change="-0.11%" up={false} />
        <TickerItem label="IBOV" value="127.830" change="+0.58%" up />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[marketStatus] }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: statusColors[marketStatus], letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
            {statusLabels[marketStatus]}
          </span>
        </div>
      </div>

      {/* Right: clock + notif + user */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {/* Clock */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-1)',
          padding: '4px 10px', background: 'var(--bg-3)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border-0)', letterSpacing: '0.04em',
        }}>
          {time.toLocaleTimeString('pt-BR', { hour12: false })}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            style={{
              width: 34, height: 34, borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: notifOpen ? 'var(--bg-3)' : 'transparent',
              color: 'var(--text-2)', border: '1px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = 'var(--bg-3)'; (e.currentTarget).style.color = 'var(--text-0)'; }}
            onMouseLeave={e => { if (!notifOpen) { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--text-2)'; } }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div style={{
              position: 'absolute', top: 7, right: 7,
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--red)', border: '1px solid var(--bg-0)',
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              width: 320, background: 'var(--bg-3)', border: '1px solid var(--border-1)',
              borderRadius: 'var(--radius-lg)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Alertas Recentes</span>
                <span style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer' }}>Ver todos</span>
              </div>
              {[
                { type: 'buy', msg: 'Sinal COMPRA WIN — Score 78.3', time: '10:42' },
                { type: 'sell', msg: 'Sinal VENDA WDO — Score 71.5', time: '10:35' },
                { type: 'info', msg: 'Confluência forte detectada', time: '10:28' },
              ].map((n, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-0)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                    background: n.type === 'buy' ? 'var(--green)' : n.type === 'sell' ? 'var(--red)' : 'var(--accent)',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-1)' }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px', borderRadius: 'var(--radius)',
              background: dropdownOpen ? 'var(--bg-3)' : 'transparent',
              border: '1px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-3)'}
            onMouseLeave={e => { if (!dropdownOpen) (e.currentTarget).style.background = 'transparent'; }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-1)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email?.split('@')[0] || 'Usuário'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-3)' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              width: 200, background: 'var(--bg-3)', border: '1px solid var(--border-1)',
              borderRadius: 'var(--radius-lg)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-0)' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.email?.split('@')[0]}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{user?.email}</div>
              </div>
              {[
                { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
                { label: 'Configurações', path: '/settings', icon: '⚙' },
                { label: 'Assinatura', path: '/billing', icon: '◈' },
              ].map(item => (
                <Link key={item.path} to={item.path} onClick={() => setDropdownOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--text-1)', fontSize: 13, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-4)'}
                  onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                >
                  <span style={{ fontSize: 14, width: 16, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border-0)' }}>
                <button onClick={logout} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', color: 'var(--red)', fontSize: 13, transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget).style.background = 'var(--red-dim)'}
                  onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {(dropdownOpen || notifOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => { setDropdownOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
}

function TickerItem({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{value}</span>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: up ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{change}</span>
    </div>
  );
}

