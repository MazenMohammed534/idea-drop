import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:px-8"
      style={{ background: 'var(--bg)', borderBottom: '3px solid var(--black)' }}
    >
      <Link to="/" className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10 md:h-12 md:w-12"
          style={{
            background: 'var(--bg)',
            border: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <img
            src="/favicon.png?v=2"
            alt="IdeaDrop"
            className="h-6 w-6 object-contain sm:h-8 sm:w-8 md:h-10 md:w-10"
          />
        </div>
        <span className="font-head hidden truncate text-base font-bold min-[340px]:inline sm:text-xl md:text-2xl">
          IdeaDrop
        </span>
      </Link>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-6">
        <Link
          to="/board"
          className="font-head hidden whitespace-nowrap text-sm font-semibold hover:underline min-[400px]:inline md:text-base"
        >
          Problems
        </Link>
        <Link
          to="/submit"
          className="btn-danger whitespace-nowrap px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm md:text-base"
        >
          <span className="min-[400px]:hidden">Submit</span>
          <span className="hidden min-[400px]:inline">Submit a problem</span>
        </Link>
      </div>
    </nav>
  )
}
