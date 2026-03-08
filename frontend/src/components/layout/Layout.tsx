import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import FloatingAIChat from './FloatingAIChat';

const NO_LAYOUT_PAGES = ['/login', '/register', '/'];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const noLayout = NO_LAYOUT_PAGES.includes(location.pathname);

  if (noLayout) return <>{children}</>;

  const sidebarW = collapsed ? 64 : 220;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
      <Topbar onMenuToggle={() => setCollapsed(!collapsed)} />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main style={{
        marginLeft: sidebarW,
        marginTop: 'var(--topbar-h)',
        minHeight: 'calc(100vh - var(--topbar-h))',
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        padding: '24px',
        position: 'relative',
      }}>
        <div className="fade-in">
          {children}
        </div>
      </main>
      <FloatingAIChat />
    </div>
  );
}
