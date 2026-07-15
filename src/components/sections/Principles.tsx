export function Principles() {
  return (
    <section className="principles-section" id="principles" aria-labelledby="principles-title">
      <div className="principle-quote">
        <p className="eyebrow"><span>[ 03 ]</span> WORKING PRINCIPLES</p>
        <h2 id="principles-title" className="sr-only">Working principles</h2>
        <blockquote>
          “The best interface is not the most impressive one. It is the one that
          makes the next good decision feel obvious.”
        </blockquote>
      </div>
      <div className="principle-grid">
        <article>
          <span>01</span><h3>Clarity is a feature</h3>
          <p>Good products explain themselves. Structure, language, and feedback should work together.</p>
        </article>
        <article>
          <span>02</span><h3>Constraints create character</h3>
          <p>Technical and business realities are design material, not inconveniences to hide.</p>
        </article>
        <article>
          <span>03</span><h3>Details carry the idea</h3>
          <p>The concept only becomes real through timing, states, responsiveness, and finish.</p>
        </article>
        <article>
          <span>04</span><h3>Leave room to learn</h3>
          <p>Build systems that can absorb new evidence without needing to start over.</p>
        </article>
      </div>
    </section>
  )
}
