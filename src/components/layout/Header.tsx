import { useEffect, useState } from 'react'
import { NAV_ITEMS } from '../../data/siteContent'
import { Arrow, Mark, Spark } from '../ui/Icons'

const NAVIGATION_ID = 'primary-navigation'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <div className="signal-bar">
        <Spark size={15} />
        <span>NOW BUILDING — A LIVING LAB FOR DIGITAL PRODUCTS</span>
        <a href="#work">
          EXPLORE <Arrow size={14} />
        </a>
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="Showcase home">
          <Mark />
          <span>SHOWCASE</span>
        </a>

        <nav
          id={NAVIGATION_ID}
          className={`nav-links ${open ? 'is-open' : ''}`}
          aria-label="Primary navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta cut-button" href="#contact">
          START SOMETHING <Arrow size={15} />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls={NAVIGATION_ID}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>
      </header>
    </>
  )
}
