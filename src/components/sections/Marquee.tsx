import { PRACTICE_AREAS } from '../../data/siteContent'
import { Spark } from '../ui/Icons'

export function Marquee() {
  return (
    <section className="marquee" aria-labelledby="practice-areas-title">
      <h2 id="practice-areas-title" className="sr-only">Areas of practice</h2>
      <div className="marquee-track" aria-hidden="true">
        {[...PRACTICE_AREAS, ...PRACTICE_AREAS].map((item, index) => (
          <span key={`${item}-${index}`}><Spark size={16} /> {item}</span>
        ))}
      </div>
    </section>
  )
}
