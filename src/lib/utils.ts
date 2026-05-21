import type { Category } from '../types'

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function formatDisplayName(name: string | null): string {
  if (!name?.trim()) return 'Anonymous'
  return name.trim()
}

export function getCategoryLabel(category: Category, customCategory?: string | null): string {
  if (category === 'Other' && customCategory?.trim()) {
    return customCategory.trim()
  }
  return category
}

export function normalizeLinkedInUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
