import type { Category } from '../types'
import { getCategoryStyle } from '../lib/categories'
import { getCategoryLabel } from '../lib/utils'

interface CategoryBadgeProps {
  category: Category
  customCategory?: string | null
}

export default function CategoryBadge({ category, customCategory }: CategoryBadgeProps) {
  const { bg, text } = getCategoryStyle(category)

  return (
    <span
      className="font-mono inline-block px-2 py-1 text-xs font-medium uppercase"
      style={{
        background: bg,
        color: text,
        border: '1px solid var(--black)',
      }}
    >
      {getCategoryLabel(category, customCategory)}
    </span>
  )
}
