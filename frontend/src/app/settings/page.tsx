'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Topbar />
      
      <main className="ml-[260px] pt-16">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-text-primary">
              Configurações
            </h1>
            <p className="text-text-secondary mt-1">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Menu */}
            <div className="lg:col-span-1">
              <div className="card">
                <nav className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-accent-primary/10 text-accent-primary border border-accent-primary/30">
                    <User className="w-5 h-5" />
                    Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <Bell className="w-5 h-5" />
                    Notificações
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <Shield className="w-5 h-5" />
                    Segurança
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <Palette className="w-5 h-5" />
                    Aparência
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <Globe className="w-5 h-5" />
                    Idiomas
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <Database className="w-5 h-5" />
                    Dados
                  </button>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <SettingsIcon className="w-6 h-6 text-accent-primary" />
                  <h2 className="text-lg font-semibold text-text-primary">Perfil</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      defaultValue="João Doe"
                      className="w-full px-4 py-3 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="joao@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Plano
                    </label>
                    <div className="px-4 py-3 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-accent-primary">
                      Plano Pro - R$ 97/mês
                    </div>
                  </div>

                  <button className="btn-primary">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

