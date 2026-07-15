import { CONTACT_EMAIL, NAV_ITEMS } from '../../data/siteContent'
import { Arrow, Mark } from '../ui/Icons'

type ContactProps = {
  onReplayIntro: () => void
}

export function Contact({ onReplayIntro }: ContactProps) {
  return (
    <footer id="contact">
      <div className="footer-cta">
        <p className="eyebrow light"><span>[ 04 ]</span> NEXT UP</p>
        <h2>Have a hard problem?<br /><span>Let’s make it tangible.</span></h2>
        <a
          className="cut-button cut-button-acid"
          href={`mailto:${CONTACT_EMAIL}`}
          data-cursor-label="HELLO"
        >
          START A CONVERSATION <Arrow />
        </a>
      </div>
      <div className="footer-bottom">
        <a className="brand footer-brand" href="#top">
          <Mark /><span>SHOWCASE</span>
        </a>
        <p>A living practice for products, systems, and useful experiments.</p>
        <nav aria-label="Footer navigation">
          {NAV_ITEMS.filter((item) => item.href !== '#contact').map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
          <button
            className="footer-replay"
            type="button"
            data-cursor-label="REPLAY"
            onClick={onReplayIntro}
          >
            REPLAY INTRO
          </button>
        </nav>
        <span>© 2026 — BUILT TO EVOLVE</span>
      </div>
    </footer>
  )
}
