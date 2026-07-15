import { useEffect, useRef } from 'react'

const INTERACTIVE_SELECTOR =
  '[data-cursor-label], a, button, [role="button"], [role="tab"]'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reducedMotion.matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let animationFrame = 0

    const positionElement = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const animate = () => {
      ringX += (targetX - ringX) * 0.14
      ringY += (targetY - ringY) * 0.14
      positionElement(ring, ringX, ringY)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const updateInteractiveState = (target: EventTarget | null) => {
      const element = target instanceof Element
        ? target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
        : null
      const cursorLabel = element?.dataset.cursorLabel ?? ''

      ring.classList.toggle('is-active', Boolean(element))
      ring.classList.toggle('has-label', Boolean(cursorLabel))
      label.textContent = cursorLabel
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      positionElement(dot, targetX, targetY)
      dot.classList.add('is-visible')
      ring.classList.add('is-visible')
      updateInteractiveState(event.target)
    }

    const onPointerLeave = () => {
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
    }

    const onPointerDown = () => ring.classList.add('is-pressed')
    const onPointerUp = () => ring.classList.remove('is-pressed')

    document.documentElement.classList.add('has-custom-cursor')
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="custom-cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
