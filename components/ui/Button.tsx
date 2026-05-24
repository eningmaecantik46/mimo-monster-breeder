'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/50',
    secondary:
      'bg-bg-card border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-bg-card',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
