import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CATEGORIES, type Category, type SortOption } from '../types'
import { getCategoryStyle } from '../lib/categories'

interface FilterBarProps {
  activeCategory: Category | 'All'
  sortBy: SortOption
  onCategoryChange: (cat: Category | 'All') => void
  onSortChange: (sort: SortOption) => void
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  upvotes: 'Most upvoted',
}

export default function FilterBar({
  activeCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false)

  const categories: (Category | 'All')[] = ['All', ...CATEGORIES]

  return (
    <div
      className="sticky top-[73px] z-40 px-4 py-3 md:px-8"
      style={{
        background: 'var(--bg)',
        borderBottom: '2px solid var(--black)',
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          const isAll = cat === 'All'
          const style = isAll ? null : getCategoryStyle(cat)

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className="font-mono px-3 py-1 text-xs font-medium uppercase transition-all duration-150"
              style={{
                background: isActive
                  ? isAll
                    ? 'var(--pink)'
                    : style!.bg
                  : isAll
                    ? 'var(--bg)'
                    : style!.bg,
                color: isActive && isAll ? 'var(--white)' : style?.text ?? 'var(--black)',
                border: 'var(--border)',
                boxShadow: isActive ? 'var(--shadow)' : 'var(--shadow-sm)',
                transform: isActive ? 'translate(-1px, -1px)' : undefined,
                opacity: !isActive && !isAll ? 0.85 : 1,
              }}
            >
              {cat}
            </button>
          )
        })}

        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="font-mono flex items-center gap-1 px-3 py-1 text-xs"
            style={{
              background: 'var(--bg)',
              border: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {SORT_LABELS[sortBy]}
            <ChevronDown size={14} />
          </button>

          {sortOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 min-w-[160px]"
              style={{
                background: 'var(--bg)',
                border: 'var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortChange(option)
                    setSortOpen(false)
                  }}
                  className="font-mono block w-full px-4 py-2 text-left text-xs hover:bg-accent"
                  style={{
                    background: sortBy === option ? 'var(--yellow)' : 'transparent',
                  }}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
