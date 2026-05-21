import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import FilterBar from '../components/FilterBar'
import ProblemCard from '../components/ProblemCard'
import ProblemDetailModal from '../components/ProblemDetailModal'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Problem, Category, SortOption } from '../types'

function SkeletonCard() {
  return (
    <div
      className="p-5"
      style={{
        background: 'var(--white)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="skeleton-shimmer h-5 w-16 rounded-none" />
      <div className="skeleton-shimmer mt-4 h-6 w-3/4 rounded-none" />
      <div className="skeleton-shimmer mt-3 h-4 w-full rounded-none" />
      <div className="skeleton-shimmer mt-2 h-4 w-2/3 rounded-none" />
      <div className="skeleton-shimmer mt-6 h-8 w-full rounded-none" />
    </div>
  )
}

export default function Board() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const hasLoadedOnce = useRef(false)
  const [animateCards, setAnimateCards] = useState(true)

  const fetchProblems = useCallback(async () => {
    if (hasLoadedOnce.current) {
      setIsRefreshing(true)
    } else {
      setInitialLoading(true)
    }
    setError('')

    if (!isSupabaseConfigured) {
      setProblems([])
      setError('Add your Supabase credentials to .env to load problems.')
      setInitialLoading(false)
      setIsRefreshing(false)
      return
    }

    try {
      let query = supabase.from('problems').select('*')

      if (activeCategory !== 'All') {
        query = query.eq('category', activeCategory)
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else {
        query = query.order('upvotes', { ascending: false })
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setProblems(
        ((data as Problem[]) ?? []).map((p) => ({
          ...p,
          open_to_collab: p.open_to_collab ?? false,
          custom_category: p.custom_category ?? null,
        }))
      )
    } catch {
      setError('Could not load problems. Please try again.')
    } finally {
      hasLoadedOnce.current = true
      setInitialLoading(false)
      setIsRefreshing(false)
    }
  }, [activeCategory, sortBy])

  useEffect(() => {
    if (!initialLoading && problems.length > 0 && animateCards) {
      const timer = setTimeout(() => setAnimateCards(false), 350)
      return () => clearTimeout(timer)
    }
  }, [initialLoading, problems.length, animateCards])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('problems-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'problems' },
        (payload) => {
          const updated = payload.new as Problem
          setProblems((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, upvotes: updated.upvotes } : p))
          )
          setSelectedProblem((prev) =>
            prev?.id === updated.id ? { ...prev, upvotes: updated.upvotes } : prev
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'problems' },
        (payload) => {
          const inserted = payload.new as Problem
          setProblems((prev) => {
            if (activeCategory !== 'All' && inserted.category !== activeCategory) {
              return prev
            }
            if (prev.some((p) => p.id === inserted.id)) return prev
            return sortBy === 'newest' ? [inserted, ...prev] : [...prev, inserted]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeCategory, sortBy])

  const handleUpvote = (id: string, count: number) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: count } : p))
    )
    setSelectedProblem((prev) =>
      prev?.id === id ? { ...prev, upvotes: count } : prev
    )
  }

  const totalCount = problems.length

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div
        className="sticky top-0 z-50"
        style={{ background: 'var(--bg)' }}
      >
        <Navbar sticky={false} />
        <FilterBar
          activeCategory={activeCategory}
          sortBy={sortBy}
          onCategoryChange={setActiveCategory}
          onSortChange={setSortBy}
        />
      </div>

      <header className="px-4 py-10 md:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-head font-extrabold" style={{ fontSize: '48px' }}>
            Problems people face
          </h1>
          {!initialLoading && (
            <span className="tag-badge text-sm">
              {totalCount} {totalCount === 1 ? 'problem' : 'problems'}
            </span>
          )}
        </div>
      </header>

      <main className="px-4 py-8 md:px-8">
        {error && (
          <p className="text-center text-sm" style={{ color: 'var(--red)' }}>
            {error}
          </p>
        )}

        {initialLoading ? (
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : problems.length === 0 && !isRefreshing ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <pre className="font-mono mb-6 text-2xl leading-none text-brand-black/40">
              {`:(
   ╭──╮
   │  │
   ╰──╯`}
            </pre>
            <p className="font-head text-xl font-bold">No problems in this category yet</p>
            <Link to="/submit" className="btn-danger mt-6 inline-block px-8 py-3">
              Submit yours
            </Link>
          </div>
        ) : (
          <div className="relative mx-auto max-w-5xl">
            {isRefreshing && (
              <div
                className="pointer-events-none absolute inset-0 z-10 flex justify-center pt-8"
                aria-live="polite"
                aria-busy="true"
              >
                <Loader2
                  size={28}
                  className="animate-spin"
                  style={{ color: 'var(--pink)' }}
                />
              </div>
            )}
            <div
              className={`grid gap-6 transition-opacity duration-150 md:grid-cols-2 ${
                isRefreshing ? 'pointer-events-none opacity-50' : 'opacity-100'
              }`}
            >
              {problems.map((problem, index) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  index={index}
                  animateEntry={animateCards && !isRefreshing}
                  onSelect={setSelectedProblem}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedProblem && (
        <ProblemDetailModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onUpvote={handleUpvote}
        />
      )}
    </div>
  )
}
