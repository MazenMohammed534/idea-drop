import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import type { Problem } from '../types'
import CategoryBadge from './CategoryBadge'
import CollabBadge from './CollabBadge'
import LinkedInLink from './LinkedInLink'
import MixedText from './MixedText'
import UpvoteButton from './UpvoteButton'
import { formatDisplayName, formatTimeAgo } from '../lib/utils'

interface ProblemDetailModalProps {
  problem: Problem
  onClose: () => void
  onUpvote?: (id: string, count: number) => void
}

export default function ProblemDetailModal({
  problem,
  onClose,
  onUpvote,
}: ProblemDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(10, 10, 10, 0.6)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="problem-detail-title"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6 md:p-8"
        style={{
          background: 'var(--white)',
          border: 'var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 p-1"
          style={{ border: 'var(--border)', boxShadow: 'var(--shadow-sm)', background: 'var(--bg)' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex flex-wrap items-center gap-2 pe-10">
          <CategoryBadge
            category={problem.category}
            customCategory={problem.custom_category}
          />
          {problem.open_to_collab && <CollabBadge />}
        </div>

        <MixedText
          as="h2"
          id="problem-detail-title"
          className="font-head text-2xl font-extrabold leading-tight md:text-3xl"
        >
          {problem.title}
        </MixedText>

        <MixedText className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-brand-black/85">
          {problem.description}
        </MixedText>

        <hr className="my-6 border-t-2 border-brand-black" />

        <Link
          to={`/problem/${problem.id}`}
          className="font-head mt-6 inline-block text-sm font-semibold hover:underline"
          style={{ color: 'var(--blue)' }}
        >
          Open full page →
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <MixedText as="p" className="font-head text-sm font-semibold">
              {formatDisplayName(problem.name)}
            </MixedText>
            <p className="font-mono mt-1 text-xs text-brand-black/60">
              {formatTimeAgo(problem.created_at)}
            </p>
            {problem.linkedin && (
              <div className="mt-3">
                <LinkedInLink url={problem.linkedin} />
              </div>
            )}
          </div>
          <UpvoteButton
            problemId={problem.id}
            upvotes={problem.upvotes}
            onUpvote={(count) => onUpvote?.(problem.id, count)}
          />
        </div>
      </div>
    </div>
  )
}
