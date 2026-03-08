'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Brain, 
  Database, 
  Settings, 
  Bell,
  TrendingUp,
  Target,
  FileText,
  Users,
  Zap
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
}

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sinais', href: '/signals', icon: Target },
  { name: 'Backtest', href: '/backtest', icon: BarChart3 },
  { name: 'Análise IA', href: '/ai-analysis', icon: Brain },
  { name: 'Scanner', href: '/scanner', icon: Activity },
  { name: 'Dados', href: '/data', icon: Database },
  { name: 'Estratégias', href: '/strategies', icon: Zap },
  { name: 'Alertas', href: '/alerts', icon: Bell },
  { name: 'Relatórios', href: '/reports', icon: FileText },
]

const secondaryItems = [
  { name: 'Desempenho', href: '/performance', icon: TrendingUp },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside 
      className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed left-0 top-0 h-screen bg-bg-primary border-r border-border-primary 
        transition-transform duration-300 z-50 flex flex-col`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold gradient-text">
            SMC Analysis
          </span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <span className="text-xs text-text-muted uppercase tracking-wider px-3">
            Principal
          </span>
        </div>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 mx-2 rounded-lg mb-1 ${
                isActive ? 'active' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}

        <div className="px-3 mt-6 mb-2">
          <span className="text-xs text-text-muted uppercase tracking-wider px-3">
            Sistema
          </span>
        </div>

        {secondaryItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item flex items-center gap-3 mx-2 rounded-lg mb-1 ${
                isActive ? 'active' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border-primary p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-secondary flex items-center justify-center">
            <span className="text-white font-bold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              João Doe
            </p>
            <p className="text-xs text-text-muted">
              Plano Pro
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

