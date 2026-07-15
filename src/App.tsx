import { useEffect, useState } from 'react'
import { Header } from './components/layout/Header'
import { IntroOverlay } from './components/layout/IntroOverlay'
import { Approach } from './components/sections/Approach'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Principles } from './components/sections/Principles'
import { Work } from './components/sections/Work'
import { CustomCursor } from './components/ui/CustomCursor'

function App() {
  const [introOpen, setIntroOpen] = useState(true)
  const [introRun, setIntroRun] = useState(0)

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const restoreIntro = (event: PageTransitionEvent) => {
      if (!event.persisted) return

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      setIntroRun((run) => run + 1)
      setIntroOpen(true)
    }

    window.addEventListener('pageshow', restoreIntro)

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
      window.removeEventListener('pageshow', restoreIntro)
    }
  }, [])

  const completeIntro = () => setIntroOpen(false)

  const replayIntro = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setIntroRun((run) => run + 1)
    setIntroOpen(true)
  }

  return (
    <div className="app-shell" id="top">
      <CustomCursor />
      {introOpen && (
        <IntroOverlay key={introRun} open onComplete={completeIntro} />
      )}
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Work />
        <Approach />
        <Principles />
      </main>
      <Contact onReplayIntro={replayIntro} />
    </div>
  )
}

export default App
