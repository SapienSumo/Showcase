import { useEffect, useState } from 'react'

type IconProps = { size?: number; className?: string }

const Arrow = ({ size = 18, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
  </svg>
)

const Spark = ({ size = 18, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2c.6 5.7 3.1 8.2 8.8 8.8-5.7.6-8.2 3.1-8.8 8.8-.6-5.7-3.1-8.2-8.8-8.8C8.9 10.2 11.4 7.7 12 2Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const Mark = () => (
  <svg className="brand-mark" viewBox="0 0 42 42" aria-hidden="true">
    <path d="M6 8h21l9 9v17H15l-9-9V8Z" fill="currentColor" />
    <path d="m13 15 8 8 8-8M21 23v8" stroke="#ecece6" strokeWidth="3" fill="none" />
  </svg>
)

const projectData = [
  {
    id: '01',
    label: 'SYSTEMS',
    title: 'Signal / Noise',
    description: 'A calm observability workspace that turns a wall of telemetry into an opinionated, actionable story.',
    tags: ['PRODUCT', 'DATA', 'INTERACTION'],
    color: 'acid',
    metric: '42%',
    metricLabel: 'faster diagnosis',
  },
  {
    id: '02',
    label: 'INTERFACES',
    title: 'Common Ground',
    description: 'A shared planning surface designed to keep teams aligned without adding another layer of process.',
    tags: ['RESEARCH', 'DESIGN', 'REACT'],
    color: 'lilac',
    metric: '3.1×',
    metricLabel: 'more decisions shipped',
  },
  {
    id: '03',
    label: 'EXPERIMENTS',
    title: 'Small Hours',
    description: 'A generative archive for collecting fragments, finding patterns, and turning unfinished thoughts into prototypes.',
    tags: ['AI', 'CREATIVE CODE', 'R&D'],
    color: 'coral',
    metric: '12',
    metricLabel: 'ideas moved to build',
  },
] as const

const capabilities = [
  ['01', 'Frame the real problem', 'Research, prototype, and pressure-test the brief before expensive decisions set in.'],
  ['02', 'Design the whole system', 'Map the interface, behavior, language, and technical constraints as one connected product.'],
  ['03', 'Build to learn', 'Ship robust slices early, instrument the result, and let real usage sharpen the next move.'],
] as const

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="signal-bar">
        <Spark size={15} />
        <span>NOW BUILDING — A LIVING LAB FOR DIGITAL PRODUCTS</span>
        <a href="#work">EXPLORE <Arrow size={14} /></a>
      </div>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="Showcase home">
          <Mark />
          <span>SHOWCASE</span>
        </a>
        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#work" onClick={() => setOpen(false)}>WORK</a>
          <a href="#approach" onClick={() => setOpen(false)}>APPROACH</a>
          <a href="#principles" onClick={() => setOpen(false)}>PRINCIPLES</a>
          <a href="#contact" onClick={() => setOpen(false)}>CONTACT</a>
        </nav>
        <a className="nav-cta cut-button" href="#contact">START SOMETHING <Arrow size={15} /></a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
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

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Abstract product system map">
      <div className="visual-axis visual-axis-x" />
      <div className="visual-axis visual-axis-y" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="signal-core">
        <span>BUILD</span>
        <strong>WITH<br />INTENT</strong>
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

function Hero() {
  return (
    <main id="top">
      <section className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span>[ 00 ]</span> INDEPENDENT PRODUCT PRACTICE</p>
          <h1>Digital products<br />that <span>hold up.</span></h1>
          <p className="hero-intro">A showcase of systems, interfaces, and experiments built with curiosity, clarity, and technical care.</p>
          <div className="hero-actions">
            <a className="cut-button cut-button-dark" href="#work">VIEW THE WORK <Arrow /></a>
            <a className="text-link" href="#approach">HOW I BUILD <Arrow size={16} /></a>
          </div>
          <div className="hero-meta">
            <span>BASED IN LONDON</span>
            <span>DESIGN × ENGINEERING</span>
            <span>EST. 2026</span>
          </div>
        </div>
        <HeroVisual />
      </section>
    </main>
  )
}

function Marquee() {
  const items = ['PRODUCT STRATEGY', 'INTERACTION DESIGN', 'REACT SYSTEMS', 'PROTOTYPING', 'CREATIVE TECHNOLOGY']
  return (
    <div className="marquee" aria-label="Areas of practice">
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}><Spark size={16} /> {item}</span>
        ))}
      </div>
    </div>
  )
}

function ProjectVisual({ project }: { project: (typeof projectData)[number] }) {
  return (
    <div className={`project-visual ${project.color}`}>
      <div className="project-noise" />
      {project.id === '01' && (
        <div className="monitor-ui">
          <div className="monitor-sidebar"><Mark /><span /><span /><span /><span /></div>
          <div className="monitor-main">
            <div className="monitor-top"><span>OVERVIEW</span><i>LIVE</i></div>
            <div className="chart">
              {[34, 42, 28, 62, 48, 72, 58, 83, 68, 91, 76, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="monitor-row"><span /><span /><span /></div>
          </div>
          <div className="alert-card"><b>ANOMALY FOUND</b><span>Checkout latency</span><strong>+187%</strong></div>
        </div>
      )}
      {project.id === '02' && (
        <div className="board-ui">
          <div className="board-toolbar"><span>COMMON GROUND</span><div><i /><i /><i /></div></div>
          <div className="board-column"><b>NOW</b><span>Map the decision</span><span>Prototype the edge</span></div>
          <div className="board-column"><b>NEXT</b><span>Test with the team</span><span>Close the loop</span></div>
          <div className="board-note">One clear next move.<i /></div>
          <div className="cursor cursor-one">P</div>
          <div className="cursor cursor-two">A</div>
        </div>
      )}
      {project.id === '03' && (
        <div className="archive-ui">
          <div className="archive-orb" />
          <div className="archive-card card-one"><span>FRAGMENT 041</span><b>What if the archive could answer back?</b></div>
          <div className="archive-card card-two"><span>PATTERN FOUND</span><b>3 connected ideas</b></div>
          <div className="archive-card card-three"><span>BUILD QUEUE</span><b>Prototype 08</b></div>
        </div>
      )}
    </div>
  )
}

function Work() {
  const [activeProject, setActiveProject] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const project = projectData[activeProject]

  return (
    <section className="work-section" id="work">
      <div className="section-heading section-grid">
        <p className="eyebrow"><span>[ 01 ]</span> SELECTED WORK</p>
        <div>
          <h2>Three ways of<br />making progress.</h2>
          <p>Different problems, one principle: make the complex legible, useful, and ready to evolve.</p>
        </div>
      </div>
      <div className="project-shell">
        <div className="project-tabs" role="tablist" aria-label="Selected projects">
          {projectData.map((item, index) => (
            <button
              key={item.id}
              className={index === activeProject ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={index === activeProject}
              onClick={() => {
                setActiveProject(index)
                setNotesOpen(false)
              }}
            >
              <span>{item.id}</span>
              <b>{item.title}</b>
              <small>{item.label}</small>
            </button>
          ))}
        </div>
        <article className="project-feature" key={project.id}>
          <div className="project-copy">
            <p className="eyebrow"><span>[ {project.id} ]</span> {project.label}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>
            <button
              className="text-link case-button"
              type="button"
              aria-expanded={notesOpen}
              onClick={() => setNotesOpen((value) => !value)}
            >
              {notesOpen ? 'HIDE CASE NOTES' : 'VIEW CASE NOTES'} <Arrow size={16} />
            </button>
            {notesOpen && (
              <div className="case-notes" role="status">
                <span>THE BUILD</span>
                <p>Started with the decision the product needed to improve, then worked backward through the signal, interaction, and system required to support it.</p>
              </div>
            )}
          </div>
          <ProjectVisual project={project} />
        </article>
      </div>
    </section>
  )
}

function Approach() {
  return (
    <section className="approach-section" id="approach">
      <div className="approach-intro section-grid">
        <p className="eyebrow light"><span>[ 02 ]</span> THE APPROACH</p>
        <div>
          <h2>Think in systems.<br /><em>Ship in slices.</em></h2>
          <p>Strong products rarely come from one big reveal. They emerge through clear framing, connected decisions, and a disciplined loop between making and learning.</p>
        </div>
      </div>
      <div className="capability-list">
        {capabilities.map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <Spark size={26} />
          </article>
        ))}
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section className="principles-section" id="principles">
      <div className="principle-quote">
        <p className="eyebrow"><span>[ 03 ]</span> WORKING PRINCIPLES</p>
        <blockquote>“The best interface is not the most impressive one. It is the one that makes the next good decision feel obvious.”</blockquote>
      </div>
      <div className="principle-grid">
        <article><span>01</span><h3>Clarity is a feature</h3><p>Good products explain themselves. Structure, language, and feedback should work together.</p></article>
        <article><span>02</span><h3>Constraints create character</h3><p>Technical and business realities are design material, not inconveniences to hide.</p></article>
        <article><span>03</span><h3>Details carry the idea</h3><p>The concept only becomes real through timing, states, responsiveness, and finish.</p></article>
        <article><span>04</span><h3>Leave room to learn</h3><p>Build systems that can absorb new evidence without needing to start over.</p></article>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer id="contact">
      <div className="footer-cta">
        <p className="eyebrow light"><span>[ 04 ]</span> NEXT UP</p>
        <h2>Have a hard problem?<br /><span>Let’s make it tangible.</span></h2>
        <a className="cut-button cut-button-acid" href="mailto:hello@example.com">START A CONVERSATION <Arrow /></a>
      </div>
      <div className="footer-bottom">
        <a className="brand footer-brand" href="#top"><Mark /><span>SHOWCASE</span></a>
        <p>A living practice for products, systems, and useful experiments.</p>
        <div><a href="#work">WORK</a><a href="#approach">APPROACH</a><a href="#principles">PRINCIPLES</a></div>
        <span>© 2026 — BUILT TO EVOLVE</span>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Hero />
      <Marquee />
      <Work />
      <Approach />
      <Principles />
      <Contact />
    </div>
  )
}

export default App
