import { Arrow } from '../ui/Icons'

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="visual-axis visual-axis-x" />
      <div className="visual-axis visual-axis-y" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="signal-core">
        <span>BUILD</span>
        <strong>
          WITH
          <br />
          INTENT
        </strong>
      </div>
      <div className="float-node node-a"><i /> RESEARCH</div>
      <div className="float-node node-b"><i /> SYSTEMS</div>
      <div className="float-node node-c"><i /> INTERFACES</div>
      <div className="float-node node-d"><i /> SHIP</div>
      <div className="terminal-card">
        <div className="terminal-head"><span /><span /><span /><b>BUILD.LOG</b></div>
        <code><em>01</em> understand the system</code>
        <code><em>02</em> find the useful edge</code>
        <code><em>03</em> make it tangible</code>
        <div className="terminal-status"><span /> READY TO ITERATE</div>
      </div>
      <span className="coordinate coordinate-a">X 51.5072</span>
      <span className="coordinate coordinate-b">Y 00.1276</span>
    </div>
  )
}

export function Hero() {
  return (
    <section className="hero section-grid" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span>[ 00 ]</span> INDEPENDENT PRODUCT PRACTICE</p>
        <h1 id="hero-title">Digital products<br />that <span>hold up.</span></h1>
        <p className="hero-intro">
          A showcase of systems, interfaces, and experiments built with curiosity,
          clarity, and technical care.
        </p>
        <div className="hero-actions">
          <a className="cut-button cut-button-dark" href="#work">
            VIEW THE WORK <Arrow />
          </a>
          <a className="text-link" href="#approach">
            HOW I BUILD <Arrow size={16} />
          </a>
        </div>
        <div className="hero-meta">
          <span>BASED IN LONDON</span>
          <span>DESIGN × ENGINEERING</span>
          <span>EST. 2026</span>
        </div>
      </div>
      <HeroVisual />
    </section>
  )
}
