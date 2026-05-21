import type { ElementType, ReactNode } from 'react'

interface MixedTextProps {
  children: ReactNode
  className?: string
  as?: ElementType
  id?: string
}

/** Renders user content with correct Arabic/English mixed direction */
export default function MixedText({
  children,
  className = '',
  as: Tag = 'p',
  id,
}: MixedTextProps) {
  return (
    <Tag dir="auto" id={id} className={`mixed-text text-start ${className}`}>
      {children}
    </Tag>
  )
}
