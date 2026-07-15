import type { Capability, NavItem, Project } from '../types/content'

export const NAV_ITEMS = [
  { href: '#work', label: 'WORK' },
  { href: '#approach', label: 'APPROACH' },
  { href: '#principles', label: 'PRINCIPLES' },
  { href: '#contact', label: 'CONTACT' },
] as const satisfies readonly NavItem[]

export const PROJECTS = [
  {
    id: '01',
    label: 'SYSTEMS',
    title: 'Signal / Noise',
    description:
      'A calm observability workspace that turns a wall of telemetry into an opinionated, actionable story.',
    tags: ['PRODUCT', 'DATA', 'INTERACTION'],
    color: 'acid',
    metric: '42%',
    metricLabel: 'faster diagnosis',
  },
  {
    id: '02',
    label: 'INTERFACES',
    title: 'Common Ground',
    description:
      'A shared planning surface designed to keep teams aligned without adding another layer of process.',
    tags: ['RESEARCH', 'DESIGN', 'REACT'],
    color: 'lilac',
    metric: '3.1×',
    metricLabel: 'more decisions shipped',
  },
  {
    id: '03',
    label: 'EXPERIMENTS',
    title: 'Small Hours',
    description:
      'A generative archive for collecting fragments, finding patterns, and turning unfinished thoughts into prototypes.',
    tags: ['AI', 'CREATIVE CODE', 'R&D'],
    color: 'coral',
    metric: '12',
    metricLabel: 'ideas moved to build',
  },
] as const satisfies readonly Project[]

export const CAPABILITIES = [
  [
    '01',
    'Frame the real problem',
    'Research, prototype, and pressure-test the brief before expensive decisions set in.',
  ],
  [
    '02',
    'Design the whole system',
    'Map the interface, behavior, language, and technical constraints as one connected product.',
  ],
  [
    '03',
    'Build to learn',
    'Ship robust slices early, instrument the result, and let real usage sharpen the next move.',
  ],
] as const satisfies readonly Capability[]

export const PRACTICE_AREAS = [
  'PRODUCT STRATEGY',
  'INTERACTION DESIGN',
  'REACT SYSTEMS',
  'PROTOTYPING',
  'CREATIVE TECHNOLOGY',
] as const

export const CONTACT_EMAIL = 'hello@example.com'
