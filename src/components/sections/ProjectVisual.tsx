import type { Project } from '../../types/content'
import { Mark } from '../ui/Icons'

type ProjectVisualProps = {
  project: Project
}

export function ProjectVisual({ project }: ProjectVisualProps) {
  return (
    <div className={`project-visual ${project.color}`} aria-hidden="true">
      <div className="project-noise" />

      {project.id === '01' && (
        <div className="monitor-ui">
          <div className="monitor-sidebar"><Mark /><span /><span /><span /><span /></div>
          <div className="monitor-main">
            <div className="monitor-top"><span>OVERVIEW</span><i>LIVE</i></div>
            <div className="chart">
              {[34, 42, 28, 62, 48, 72, 58, 83, 68, 91, 76, 88].map(
                (height, index) => <i key={index} style={{ height: `${height}%` }} />,
              )}
            </div>
            <div className="monitor-row"><span /><span /><span /></div>
          </div>
          <div className="alert-card">
            <b>ANOMALY FOUND</b><span>Checkout latency</span><strong>+187%</strong>
          </div>
        </div>
      )}

      {project.id === '02' && (
        <div className="board-ui">
          <div className="board-toolbar">
            <span>COMMON GROUND</span><div><i /><i /><i /></div>
          </div>
          <div className="board-column">
            <b>NOW</b><span>Map the decision</span><span>Prototype the edge</span>
          </div>
          <div className="board-column">
            <b>NEXT</b><span>Test with the team</span><span>Close the loop</span>
          </div>
          <div className="board-note">One clear next move.<i /></div>
          <div className="cursor cursor-one">P</div>
          <div className="cursor cursor-two">A</div>
        </div>
      )}

      {project.id === '03' && (
        <div className="archive-ui">
          <div className="archive-orb" />
          <div className="archive-card card-one">
            <span>FRAGMENT 041</span><b>What if the archive could answer back?</b>
          </div>
          <div className="archive-card card-two">
            <span>PATTERN FOUND</span><b>3 connected ideas</b>
          </div>
          <div className="archive-card card-three">
            <span>BUILD QUEUE</span><b>Prototype 08</b>
          </div>
        </div>
      )}
    </div>
  )
}
