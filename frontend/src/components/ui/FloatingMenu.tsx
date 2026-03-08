'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Activity, Target, Bell, Home } from 'lucide-react'

export default function FloatingMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-end gap-3">
        {open && (
          <>
            <Link href="/scanner" className="p-3 rounded-lg bg-bg-tertiary border border-border-primary hover:border-accent-primary transition-colors">
              <Activity className="w-5 h-5 text-text-secondary" />
            </Link>
            <Link href="/signals" className="p-3 rounded-lg bg-bg-tertiary border border-border-primary hover:border-accent-primary transition-colors">
              <Target className="w-5 h-5 text-text-secondary" />
            </Link>
            <Link href="/alerts" className="p-3 rounded-lg bg-bg-tertiary border border-border-primary hover:border-accent-primary transition-colors">
              <Bell className="w-5 h-5 text-text-secondary" />
            </Link>
            <Link href="/dashboard" className="p-3 rounded-lg bg-bg-tertiary border border-border-primary hover:border-accent-primary transition-colors">
              <Home className="w-5 h-5 text-text-secondary" />
            </Link>
          </>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label="Ações"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
