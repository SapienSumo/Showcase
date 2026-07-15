export type ProjectColor = 'acid' | 'lilac' | 'coral'

export type Project = {
  readonly id: string
  readonly label: string
  readonly title: string
  readonly description: string
  readonly tags: readonly string[]
  readonly color: ProjectColor
  readonly metric: string
  readonly metricLabel: string
}

export type Capability = readonly [
  number: string,
  title: string,
  description: string,
]

export type NavItem = {
  readonly href: `#${string}`
  readonly label: string
}
