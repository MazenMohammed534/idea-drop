export type Category =
  | 'Education'
  | 'Health'
  | 'Transportation'
  | 'Food'
  | 'Fintech'
  | 'Productivity'
  | 'Technology'
  | 'Other'

export const CATEGORIES: Category[] = [
  'Education',
  'Health',
  'Transportation',
  'Food',
  'Fintech',
  'Productivity',
  'Technology',
  'Other',
]

export interface Problem {
  id: string
  title: string
  description: string
  category: Category
  custom_category: string | null
  name: string | null
  linkedin: string | null
  open_to_collab: boolean
  upvotes: number
  created_at: string
}

export interface SubmitForm {
  title: string
  description: string
  category: Category | ''
  custom_category: string
  name: string
  linkedin: string
  open_to_collab: boolean
}

export type SortOption = 'newest' | 'upvotes'
