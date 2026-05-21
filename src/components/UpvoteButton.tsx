import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface UpvoteButtonProps {
  problemId: string
  upvotes: number
  onUpvote?: (newCount: number) => void
  onClick?: (e: React.MouseEvent) => void
}

function getVotedKey(problemId: string) {
  return `voted_${problemId}`
}

export default function UpvoteButton({
  problemId,
  upvotes,
  onUpvote,
  onClick,
}: UpvoteButtonProps) {
  const votedKey = getVotedKey(problemId)

  const [voted, setVoted] = useState(() => localStorage.getItem(votedKey) === 'true')
  const [count, setCount] = useState(upvotes)
  const [loading, setLoading] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setCount(upvotes)
    if (localStorage.getItem(votedKey) === 'true') {
      setVoted(true)
    }
  }, [upvotes, votedKey])

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)
    if (loading || !isSupabaseConfigured) return

    setAnimating(true)
    setTimeout(() => setAnimating(false), 150)
    setLoading(true)

    try {
      if (voted) {
        const { error: rpcError } = await supabase.rpc('decrement_upvote', {
          problem_id: problemId,
        })

        if (rpcError) {
          const { data: row, error: fetchError } = await supabase
            .from('problems')
            .select('upvotes')
            .eq('id', problemId)
            .single()

          if (fetchError) throw fetchError

          const { error: updateError } = await supabase
            .from('problems')
            .update({ upvotes: Math.max(0, (row?.upvotes ?? count) - 1) })
            .eq('id', problemId)

          if (updateError) throw updateError
        }

        const newCount = Math.max(0, count - 1)
        setCount(newCount)
        setVoted(false)
        localStorage.removeItem(votedKey)
        onUpvote?.(newCount)
      } else {
        const { error: rpcError } = await supabase.rpc('increment_upvote', {
          problem_id: problemId,
        })

        if (rpcError) {
          const { data: row, error: fetchError } = await supabase
            .from('problems')
            .select('upvotes')
            .eq('id', problemId)
            .single()

          if (fetchError) throw fetchError

          const { error: updateError } = await supabase
            .from('problems')
            .update({ upvotes: (row?.upvotes ?? count) + 1 })
            .eq('id', problemId)

          if (updateError) throw updateError
        }

        const newCount = count + 1
        setCount(newCount)
        setVoted(true)
        localStorage.setItem(votedKey, 'true')
        onUpvote?.(newCount)
      }
    } catch {
      // keep UI unchanged on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="font-mono flex items-center gap-1 px-3 py-1 text-sm font-medium transition-all duration-150"
      style={{
        background: voted ? 'var(--pink)' : 'var(--bg)',
        color: voted ? 'var(--white)' : 'var(--black)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transform: animating ? 'scale(0.95)' : undefined,
        cursor: loading ? 'wait' : 'pointer',
      }}
      aria-label={voted ? `Remove upvote (${count})` : `Upvote (${count})`}
      title={voted ? 'Click to remove your upvote' : 'Click to upvote'}
    >
      <span>▲</span>
      <span>{count}</span>
    </button>
  )
}
