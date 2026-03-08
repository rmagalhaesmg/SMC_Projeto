'use client'

import React from 'react'
import { Search, Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react'

interface TopbarProps {
  onThemeToggle?: () => void
  isDarkMode?: boolean
}

export default function Topbar({ onThemeToggle, isDarkMode = true }: TopbarProps) {
  return (
    <header className="topbar">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar ativo, símbolo..."
            className="bg-bg-tertiary border border-border-primary rounded-lg pl-10 pr-4 py-2 
              text-sm text-text-primary placeholder:text-text-muted focus:outline-none 
              focus:border-accent-primary w-80 transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-danger rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors">
          <Settings className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border-primary" />

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">João Doe</p>
            <p className="text-xs text-text-muted">Plano Pro</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}

