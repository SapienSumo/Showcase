type IconProps = {
  size?: number
  className?: string
}

export function Arrow({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function Spark({ size = 18, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2c.6 5.7 3.1 8.2 8.8 8.8-5.7.6-8.2 3.1-8.8 8.8-.6-5.7-3.1-8.2-8.8-8.8C8.9 10.2 11.4 7.7 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function Mark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 42 42">
      <path d="M6 8h21l9 9v17H15l-9-9V8Z" fill="currentColor" />
      <path
        d="m13 15 8 8 8-8M21 23v8"
        stroke="#ecece6"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}
