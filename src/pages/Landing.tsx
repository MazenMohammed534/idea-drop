import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const STEPS = [
  {
    num: '01',
    title: 'Write a problem',
    desc: 'you face in daily life',
    borderColor: 'var(--pink)',
  },
  {
    num: '02',
    title: 'People vote',
    desc: 'on the best ideas',
    borderColor: 'var(--blue)',
  },
  {
    num: '03',
    title: 'Someone builds it',
    desc: 'as a graduation project or startup',
    borderColor: 'var(--yellow)',
  },
]

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
        <div
          className="absolute left-4 top-8 h-16 w-16 md:h-24 md:w-24"
          style={{ background: 'var(--yellow)', border: 'var(--border)' }}
        />

        <div
          className="absolute right-8 top-32 hidden h-32 w-48 border-2 border-dashed border-brand-black md:block"
          style={{ transform: 'translate(12px, 8px)' }}
        />

        <div className="relative mx-auto max-w-4xl">
          <span className="btn-secondary inline-block px-4 py-1 text-sm">New</span>

          <h1
            className="font-head mt-6 font-extrabold leading-tight"
            style={{ fontSize: 'clamp(40px, 8vw, 72px)' }}
          >
            Get that problem
            <br />
            out of your head.
          </h1>

          <p className="font-body mt-6 max-w-xl text-xl leading-relaxed">
            Share a real problem you face every day —
            <br />
            someone else might build it as a graduation project or startup.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/submit" className="btn-danger px-8 py-3 text-lg">
              Submit your problem
            </Link>
            <Link to="/board" className="btn-secondary px-8 py-3 text-lg">
              Browse problems
            </Link>
          </div>
        </div>
      </section>

      <section className="section-divider px-4 py-16 md:px-8">
        <h2 className="font-head mb-10 text-center text-3xl font-bold md:text-4xl">
          How it works
        </h2>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="neo-card p-6 opacity-0"
              style={{
                borderTop: `4px solid ${step.borderColor}`,
                animation: 'slideUp 0.4s ease forwards',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <span className="font-mono text-4xl font-bold text-brand-black/30">
                {step.num}
              </span>
              <h3 className="font-head mt-4 text-xl font-bold">{step.title}</h3>
              <p className="font-body mt-2 text-brand-black/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="px-4 py-16 text-center md:px-8"
        style={{ background: 'var(--black)', padding: '60px 24px' }}
      >
        <p
          className="font-head font-bold"
          style={{ color: 'var(--yellow)', fontSize: 'clamp(24px, 5vw, 36px)' }}
        >
          Got a problem? Share it with us.
        </p>
        <Link
          to="/submit"
          className="btn-danger mt-8 inline-block px-10 py-4 text-lg"
        >
          Submit your problem
        </Link>
      </section>

      <footer className="section-divider px-4 py-8 text-center font-body text-sm md:px-8">
        IdeaDrop © 2025 
      </footer>
    </div>
  )
}
