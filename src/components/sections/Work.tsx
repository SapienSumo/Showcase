import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { PROJECTS } from '../../data/siteContent'
import { Arrow } from '../ui/Icons'
import { ProjectVisual } from './ProjectVisual'

const projectTabId = (projectId: string) => `project-tab-${projectId}`
const projectPanelId = (projectId: string) => `project-panel-${projectId}`
const projectNotesId = (projectId: string) => `project-notes-${projectId}`

export function Work() {
  const [activeProject, setActiveProject] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const project = PROJECTS[activeProject]

  const selectProject = (index: number) => {
    setActiveProject(index)
    setNotesOpen(false)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | undefined

    if (event.key === 'ArrowRight') nextIndex = (activeProject + 1) % PROJECTS.length
    if (event.key === 'ArrowLeft') nextIndex = (activeProject - 1 + PROJECTS.length) % PROJECTS.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = PROJECTS.length - 1
    if (nextIndex === undefined) return

    event.preventDefault()
    selectProject(nextIndex)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="section-heading section-grid">
        <p className="eyebrow"><span>[ 01 ]</span> SELECTED WORK</p>
        <div>
          <h2 id="work-title">Three ways of<br />making progress.</h2>
          <p>
            Different problems, one principle: make the complex legible, useful,
            and ready to evolve.
          </p>
        </div>
      </div>

      <div className="project-shell">
        <div className="project-tabs" role="tablist" aria-label="Selected projects">
          {PROJECTS.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabRefs.current[index] = element }}
              id={projectTabId(item.id)}
              className={index === activeProject ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={index === activeProject}
              aria-controls={projectPanelId(item.id)}
              tabIndex={index === activeProject ? 0 : -1}
              onClick={() => selectProject(index)}
              onKeyDown={handleTabKeyDown}
            >
              <span>{item.id}</span>
              <b>{item.title}</b>
              <small>{item.label}</small>
            </button>
          ))}
        </div>

        <article
          key={project.id}
          id={projectPanelId(project.id)}
          className="project-feature"
          role="tabpanel"
          aria-labelledby={projectTabId(project.id)}
          tabIndex={0}
        >
          <div className="project-copy">
            <p className="eyebrow"><span>[ {project.id} ]</span> {project.label}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-metric">
              <strong>{project.metric}</strong><span>{project.metricLabel}</span>
            </div>
            <button
              className="text-link case-button"
              type="button"
              aria-expanded={notesOpen}
              aria-controls={projectNotesId(project.id)}
              onClick={() => setNotesOpen((value) => !value)}
            >
              {notesOpen ? 'HIDE CASE NOTES' : 'VIEW CASE NOTES'} <Arrow size={16} />
            </button>
            <div
              id={projectNotesId(project.id)}
              className="case-notes"
              role="status"
              hidden={!notesOpen}
            >
              <span>THE BUILD</span>
              <p>
                Started with the decision the product needed to improve, then worked
                backward through the signal, interaction, and system required to support it.
              </p>
            </div>
          </div>
          <ProjectVisual project={project} />
        </article>
      </div>
    </section>
  )
}
