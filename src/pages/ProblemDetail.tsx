import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryBadge from '../components/CategoryBadge'
import CollabBadge from '../components/CollabBadge'
import LinkedInLink from '../components/LinkedInLink'
import MixedText from '../components/MixedText'
import UpvoteButton from '../components/UpvoteButton'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatDisplayName, formatTimeAgo } from '../lib/utils'
import type { Problem } from '../types'

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !isSupabaseConfigured) {
      setLoading(false)
      setError('Problem not found.')
      return
    }

    const fetchProblem = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from('problems')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        setProblem({
          ...(data as Problem),
          open_to_collab: data.open_to_collab ?? false,
          custom_category: data.custom_category ?? null,
        })
      } catch {
        setError('Could not load this problem.')
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id])

  const handleUpvote = (count: number) => {
    if (problem) setProblem({ ...problem, upvotes: count })
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        <Link to="/board" className="font-head text-sm font-semibold hover:underline">
          ← Back to problems
        </Link>

        {loading ? (
          <p className="font-body mt-8">Loading...</p>
        ) : error || !problem ? (
          <p className="mt-8 text-sm" style={{ color: 'var(--red)' }}>
            {error || 'Problem not found.'}
          </p>
        ) : (
          <article
            className="neo-card mt-8 p-6 md:p-8"
            style={{ cursor: 'default' }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <CategoryBadge
                category={problem.category}
                customCategory={problem.custom_category}
              />
              {problem.open_to_collab && <CollabBadge />}
            </div>

            <MixedText
              as="h1"
              className="font-head text-3xl font-extrabold leading-tight md:text-4xl"
            >
              {problem.title}
            </MixedText>

            <MixedText className="mt-6 whitespace-pre-wrap text-lg leading-relaxed">
              {problem.description}
            </MixedText>

            <hr className="my-8 border-t-2 border-brand-black" />

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <MixedText as="p" className="font-head font-semibold">
                  {formatDisplayName(problem.name)}
                </MixedText>
                <p className="font-mono mt-1 text-sm text-brand-black/60">
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
                onUpvote={handleUpvote}
              />
            </div>
          </article>
        )}
      </main>
    </div>
  )
}
