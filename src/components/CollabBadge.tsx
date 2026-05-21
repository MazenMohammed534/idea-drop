import { Users } from 'lucide-react'

export default function CollabBadge() {
  return (
    <span
      className="font-mono inline-flex items-center gap-1 px-2 py-1 text-xs font-medium uppercase"
      style={{
        background: 'var(--blue)',
        color: 'var(--white)',
        border: '1px solid var(--black)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Users size={12} />
      Open to collab
    </span>
  )
}
