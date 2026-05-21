import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Check, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getCategoryStyle } from '../lib/categories'
import { CATEGORIES, type SubmitForm } from '../types'

interface FormErrors {
  title?: string
  description?: string
  category?: string
  custom_category?: string
}

const EMPTY_FORM: SubmitForm = {
  title: '',
  description: '',
  category: '',
  custom_category: '',
  name: '',
  linkedin: '',
  open_to_collab: false,
}

function validate(form: SubmitForm): FormErrors {
  const errors: FormErrors = {}
  if (form.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters'
  } else if (form.title.length > 80) {
    errors.title = 'Title cannot exceed 80 characters'
  }
  if (form.description.trim().length < 50) {
    errors.description = 'Description must be at least 50 characters'
  } else if (form.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters'
  }
  if (!form.category) {
    errors.category = 'Please select a category'
  }
  if (form.category === 'Other' && form.custom_category.trim().length < 2) {
    errors.custom_category = 'Please describe what type of problem this is (min 2 characters)'
  }
  return errors
}

export default function Submit() {
  const [form, setForm] = useState<SubmitForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const update = <K extends keyof SubmitForm>(field: K, value: SubmitForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field !== 'open_to_collab') {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (!isSupabaseConfigured) {
      setSubmitError('Add your Supabase credentials to .env to submit problems.')
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const { error } = await supabase.from('problems').insert({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        custom_category:
          form.category === 'Other' ? form.custom_category.trim() : null,
        name: form.name.trim() || null,
        linkedin: form.linkedin.trim() || null,
        open_to_collab: form.open_to_collab,
      })

      if (error) throw error
      setSuccess(true)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : ''
      if (message.includes('open_to_collab')) {
        setSubmitError(
          'Database is missing the collab column.'
        )
      } else if (message.includes('category')) {
        setSubmitError(
          'Category mismatch.'
        )
      } else {
        setSubmitError('Something went wrong while submitting. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSuccess(false)
    setSubmitError('')
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        <h1 className="font-head font-extrabold" style={{ fontSize: '48px' }}>
          Submit your problem
          <span
            className="mt-2 block h-1 w-32"
            style={{ background: 'var(--pink)' }}
          />
        </h1>

        {success ? (
          <div className="neo-card mx-auto mt-12 max-w-lg p-10 text-center">
            <Check size={48} style={{ color: 'var(--pink)', margin: '0 auto' }} />
            <h2 className="font-head mt-6 text-3xl font-bold">
              Thanks! Your problem was submitted 🎉
            </h2>
            <p className="font-body mt-4 text-lg">We&apos;ll try to find it a solution soon.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/board" className="btn-primary w-full py-3 text-center">
                Browse other problems →
              </Link>
              <button type="button" onClick={resetForm} className="btn-secondary w-full py-3">
                Submit another problem
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label className="font-head mb-2 block font-semibold">
                Problem in one sentence *
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="auto"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  maxLength={80}
                  placeholder="e.g. No app helps me track my daily spending"
                  className={`neo-input ${errors.title ? 'neo-input-error' : ''}`}
                />
                <span className="font-mono absolute bottom-3 end-3 text-xs text-brand-black/50">
                  {form.title.length}/80
                </span>
              </div>
              {errors.title && (
                <p className="mt-1 text-sm" style={{ color: 'var(--red)' }}>
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="font-head mb-2 block font-semibold">
                Describe the problem in more detail *
              </label>
              <div className="relative">
                <textarea
                  dir="auto"
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="When do you face this? How does it affect your life?"
                  className={`neo-input resize-y ${errors.description ? 'neo-input-error' : ''}`}
                />
                <span className="font-mono absolute bottom-3 end-3 text-xs text-brand-black/50">
                  {form.description.length}/500
                </span>
              </div>
              {errors.description && (
                <p className="mt-1 text-sm" style={{ color: 'var(--red)' }}>
                  {errors.description}
                </p>
              )}
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="font-head mb-2 block font-semibold">Category *</label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`neo-input flex w-full items-center justify-between text-left ${errors.category ? 'neo-input-error' : ''}`}
              >
                <span className={form.category ? '' : 'text-brand-black/40'}>
                  {form.category || 'Select a category'}
                </span>
                <ChevronDown size={18} />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute z-50 mt-1 w-full"
                  style={{
                    background: 'var(--bg)',
                    border: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  {CATEGORIES.map((cat) => {
                    const { bg, text } = getCategoryStyle(cat)
                    const selected = form.category === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            category: cat,
                            custom_category: cat === 'Other' ? prev.custom_category : '',
                          }))
                          setErrors((prev) => ({
                            ...prev,
                            category: undefined,
                            custom_category: undefined,
                          }))
                          setDropdownOpen(false)
                        }}
                        className="font-body block w-full px-4 py-3 text-left"
                        style={{
                          background: selected ? bg : 'transparent',
                          color: selected ? text : 'var(--black)',
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )}
              {errors.category && (
                <p className="mt-1 text-sm" style={{ color: 'var(--red)' }}>
                  {errors.category}
                </p>
              )}
            </div>

            {form.category === 'Other' && (
              <div>
                <label className="font-head mb-2 block font-semibold">
                  What type of problem is this? *
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={form.custom_category}
                  onChange={(e) => update('custom_category', e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Legal, Housing, Fitness..."
                  className={`neo-input ${errors.custom_category ? 'neo-input-error' : ''}`}
                />
                {errors.custom_category && (
                  <p className="mt-1 text-sm" style={{ color: 'var(--red)' }}>
                    {errors.custom_category}
                  </p>
                )}
              </div>
            )}


            <div>
              <label className="font-head mb-2 block font-semibold">Your name (optional)</label>
              <input
                type="text"
                dir="auto"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Enter your name"
                className="neo-input"
              />
            </div>

            <label
              className="neo-card flex cursor-pointer items-start gap-3 p-4"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <input
                type="checkbox"
                checked={form.open_to_collab}
                onChange={(e) => update('open_to_collab', e.target.checked)}
                className="mt-1 h-5 w-5 accent-[var(--blue)]"
                style={{ border: 'var(--border)' }}
              />
              <span>
                <span className="font-head block font-semibold">
                  I&apos;m open to collaborating on this problem
                </span>
                <span className="font-body mt-1 block text-sm text-brand-black/70">
                  Shows an &quot;Open to collab&quot; badge on your problem card so builders can
                  reach out.
                </span>
              </span>
            </label>
            {form.open_to_collab && (
              <div>
                <label className="font-head mb-2 block font-semibold">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={(e) => update('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="neo-input"
                />
              </div>
            )}
     

            {submitError && (
              <p className="text-sm" style={{ color: 'var(--red)' }}>
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-danger flex w-full items-center justify-center gap-2 py-4 text-lg"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit this problem →'
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
