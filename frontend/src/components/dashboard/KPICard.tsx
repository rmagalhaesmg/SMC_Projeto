'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'neutral'
}

export default function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel,
  icon,
  variant = 'default' 
}: KPICardProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-accent-success'
      case 'danger':
        return 'border-l-accent-danger'
      case 'warning':
        return 'border-l-accent-warning'
      case 'neutral':
        return 'border-l-text-muted'
      default:
        return 'border-l-accent-primary'
    }
  }

  const getValueColor = () => {
    switch (variant) {
      case 'success':
        return 'text-accent-success'
      case 'danger':
        return 'text-accent-danger'
      case 'warning':
        return 'text-accent-warning'
      default:
        return 'text-text-primary'
    }
  }

  return (
    <div className={`kpi-card border-l-4 ${getVariantStyles()}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="kpi-label">{title}</span>
        {icon && <div className="text-accent-primary">{icon}</div>}
      </div>
      
      <div className={`kpi-value ${getValueColor()}`}>
        {value}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 mt-2">
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 text-accent-success" />
          ) : change < 0 ? (
            <TrendingDown className="w-4 h-4 text-accent-danger" />
          ) : (
            <Minus className="w-4 h-4 text-text-muted" />
          )}
          
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-accent-success' : 
            change < 0 ? 'text-accent-danger' : 
            'text-text-muted'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          
          {changeLabel && (
            <span className="text-xs text-text-muted">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

