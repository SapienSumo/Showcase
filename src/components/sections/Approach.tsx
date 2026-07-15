import { CAPABILITIES } from '../../data/siteContent'
import { Spark } from '../ui/Icons'

export function Approach() {
  return (
    <section className="approach-section" id="approach" aria-labelledby="approach-title">
      <div className="approach-intro section-grid">
        <p className="eyebrow light"><span>[ 02 ]</span> THE APPROACH</p>
        <div>
          <h2 id="approach-title">Think in systems.<br /><em>Ship in slices.</em></h2>
          <p>
            Strong products rarely come from one big reveal. They emerge through clear
            framing, connected decisions, and a disciplined loop between making and learning.
          </p>
        </div>
      </div>
      <div className="capability-list">
        {CAPABILITIES.map(([number, title, description]) => (
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
