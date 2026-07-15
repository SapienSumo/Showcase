import { useEffect, useRef, useState } from 'react'
import { Arrow, Mark } from '../ui/Icons'

type IntroPhase = 'loading' | 'ready' | 'exiting'

type IntroOverlayProps = {
  open: boolean
  onComplete: () => void
}

export function IntroOverlay({ open, onComplete }: IntroOverlayProps) {
  const [phase, setPhase] = useState<IntroPhase>('loading')
  const beginButtonRef = useRef<HTMLButtonElement>(null)
  const exitTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!open) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const readyTimer = window.setTimeout(
      () => setPhase('ready'),
      reducedMotion ? 80 : 2300,
    )

    return () => {
      window.clearTimeout(readyTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (phase === 'ready') beginButtonRef.current?.focus()
  }, [phase])

  useEffect(() => {
    return () => window.clearTimeout(exitTimerRef.current)
  }, [])

  if (!open) return null

  const begin = () => {
    if (phase !== 'ready') return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhase('exiting')
    exitTimerRef.current = window.setTimeout(
      onComplete,
      reducedMotion ? 80 : 1350,
    )
  }

  return (
    <div
      className={`intro-overlay is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      aria-describedby="intro-description"
    >
      <div className="intro-backdrop" />
      <div className="intro-fog intro-fog-one" aria-hidden="true" />
      <div className="intro-fog intro-fog-two" aria-hidden="true" />

      <div className="intro-topline">
        <div className="brand intro-brand"><Mark /><span>SHOWCASE</span></div>
        <span>SESSION / 001</span>
      </div>

      <div className="intro-content">
        <p className="intro-kicker">[ INITIALIZING A LIVING PRACTICE ]</p>
        <h1 id="intro-title">
          <span>IDEAS NEED</span>
          <span className="intro-outline">FORM.</span>
          <span>SYSTEMS NEED</span>
          <span className="intro-acid">SOUL.</span>
        </h1>
        <p id="intro-description" className="intro-description">
          Systems, interfaces, and experiments built with intent.
        </p>

        <div className="intro-action-zone" aria-live="polite">
          {phase === 'loading' ? (
            <div className="intro-loading">
              <span>CALIBRATING SIGNAL</span>
              <div className="intro-progress"><i /></div>
            </div>
          ) : (
            <button
              ref={beginButtonRef}
              className="intro-begin cut-button cut-button-acid"
              type="button"
              data-cursor-label="BEGIN"
              disabled={phase === 'exiting'}
              onClick={begin}
            >
              BEGIN <Arrow />
            </button>
          )}
        </div>
      </div>

      <div className="intro-coordinates" aria-hidden="true">
        <span>51.5072° N</span>
        <span>0.1276° W</span>
        <span>DESIGN × ENGINEERING</span>
      </div>
    </div>
  )
}
