import type { Category } from '../types'

export interface CategoryStyle {
  bg: string
  text: string
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  Education: { bg: '#93C5FD', text: '#0A0A0A' },
  Health: { bg: '#86EFAC', text: '#0A0A0A' },
  Transportation: { bg: '#FDBA74', text: '#0A0A0A' },
  Food: { bg: '#FCA5A5', text: '#0A0A0A' },
  Fintech: { bg: '#C4B5FD', text: '#0A0A0A' },
  Productivity: { bg: '#67E8F9', text: '#0A0A0A' },
  Technology: { bg: '#7B9FFF', text: '#0A0A0A' },
  Other: { bg: '#FFE566', text: '#0A0A0A' },
}

export function getCategoryStyle(category: Category): CategoryStyle {
  return CATEGORY_STYLES[category]
}
