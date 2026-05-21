import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8"
      style={{ background: 'var(--bg)', borderBottom: '3px solid var(--black)' }}
    >
      <Link to="/" className="flex items-center gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center md:h-12 md:w-12"
          style={{
            background: 'var(--bg)',
            border: 'var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <img
            src="/favicon.png?v=2"
            alt="IdeaDrop"
            className="h-8 w-8 object-contain md:h-10 md:w-10"
          />
        </div>
        <span className="font-head text-xl font-bold md:text-2xl">IdeaDrop</span>
      </Link>
      <div className="flex items-center gap-3 md:gap-6">
        <Link
          to="/board"
          className="font-head text-sm font-semibold md:text-base hover:underline"
        >
          Problems
        </Link>
        <Link to="/submit" className="btn-danger px-4 py-2 text-sm md:text-base">
          Submit a problem
        </Link>
      </div>
    </nav>
  )
}
