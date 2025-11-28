import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFloat(value: number | string | undefined | null, decimals = 2) {
  if (value === undefined || value === null || value === '') return '0.00'
  const n = typeof value === 'string' ? parseFloat(value) : Number(value)
  if (Number.isNaN(n)) return '0.00'
  return n.toFixed(decimals)
}
