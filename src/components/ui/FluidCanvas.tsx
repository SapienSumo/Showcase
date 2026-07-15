import { useEffect, useRef } from 'react'
import { createFluidSimulation } from '../../lib/fluidSimulation'

export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bloomRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const bloom = bloomRef.current
    const host = canvas?.closest<HTMLElement>('.intro-overlay')
    if (!canvas || !bloom || !host) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    let inViewport = false
    let simulation: ReturnType<typeof createFluidSimulation> = null
    let unsupported = false
    let bloomTimer: number | undefined

    const hideBloom = () => {
      window.clearTimeout(bloomTimer)
      bloom.classList.remove('is-visible')
    }

    const syncActivity = () => {
      simulation?.setViewportActive(inViewport && !document.hidden)
    }

    const startSimulation = () => {
      if (unsupported) return null
      if (!simulation) {
        try {
          simulation = createFluidSimulation(canvas)
          unsupported = !simulation
        } catch {
          unsupported = true
        }
      }
      syncActivity()
      return simulation
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!inViewport) return
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const fluid = startSimulation()
      const color = fluid?.pointerMove(
        Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
        1 - Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
      )
      if (!color) return

      const channels = color.map((channel) => Math.round(Math.min(channel * 1.3, 1) * 255))
      bloom.style.setProperty('--intro-bloom-x', `${event.clientX - rect.left}px`)
      bloom.style.setProperty('--intro-bloom-y', `${event.clientY - rect.top}px`)
      bloom.style.setProperty('--intro-bloom-color', channels.join(', '))
      bloom.classList.add('is-visible')
      window.clearTimeout(bloomTimer)
      bloomTimer = window.setTimeout(() => bloom.classList.remove('is-visible'), 260)
    }

    const onPointerLeave = () => {
      simulation?.resetPointer()
      hideBloom()
    }
    const onVisibilityChange = () => {
      syncActivity()
      if (document.hidden) hideBloom()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      syncActivity()
      if (!inViewport) hideBloom()
    }, { threshold: 0.08 })

    observer.observe(host)
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.clearTimeout(bloomTimer)
      simulation?.destroy()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="intro-fluid" aria-hidden="true" />
      <span ref={bloomRef} className="intro-bloom" aria-hidden="true" />
    </>
  )
}
