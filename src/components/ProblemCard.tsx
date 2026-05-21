import type { Problem } from '../types'
import CategoryBadge from './CategoryBadge'
import CollabBadge from './CollabBadge'
import LinkedInLink from './LinkedInLink'
import MixedText from './MixedText'
import UpvoteButton from './UpvoteButton'
import { formatDisplayName, formatTimeAgo } from '../lib/utils'

interface ProblemCardProps {
  problem: Problem
  index?: number
  onSelect?: (problem: Problem) => void
  onUpvote?: (id: string, count: number) => void
}

export default function ProblemCard({
  problem,
  index = 0,
  onSelect,
  onUpvote,
}: ProblemCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {problem.open_to_collab && (
        <div className="flex justify-start">
          <CollabBadge />
        </div>
      )}

      <article
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(problem)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect?.(problem)
          }
        }}
        className="neo-card flex cursor-pointer flex-col p-5 opacity-0"
        style={{
          animation: 'slideUp 0.4s ease forwards',
          animationDelay: `${index * 0.08}s`,
        }}
      >
        <CategoryBadge
          category={problem.category}
          customCategory={problem.custom_category}
        />

        <MixedText
          as="h3"
          className="font-head mt-3 text-lg font-bold leading-snug"
        >
          {problem.title}
        </MixedText>

        <MixedText className="mt-2 line-clamp-2 text-base text-brand-black/80">
          {problem.description}
        </MixedText>

        <hr className="my-4 border-t-2 border-brand-black" />

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <MixedText as="p" className="font-head text-sm font-semibold">
              {formatDisplayName(problem.name)}
            </MixedText>
            <p className="font-mono mt-1 text-xs text-brand-black/60">
              {formatTimeAgo(problem.created_at)}
            </p>
            {problem.linkedin && (
              <div className="mt-2">
                <LinkedInLink
                  url={problem.linkedin}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          <UpvoteButton
            problemId={problem.id}
            upvotes={problem.upvotes}
            onUpvote={(count) => onUpvote?.(problem.id, count)}
          />
        </div>
      </article>
    </div>
  )
}
