import { ExternalLink } from 'lucide-react'
import { normalizeLinkedInUrl } from '../lib/utils'

interface LinkedInLinkProps {
  url: string
  onClick?: (e: React.MouseEvent) => void
}

export default function LinkedInLink({ url, onClick }: LinkedInLinkProps) {
  const href = normalizeLinkedInUrl(url)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="font-head inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
      style={{ color: 'var(--blue)' }}
    >
      <ExternalLink size={14} strokeWidth={2.5} />
      LinkedIn Profile
    </a>
  )
}
