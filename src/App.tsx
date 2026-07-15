import { Header } from './components/layout/Header'
import { Approach } from './components/sections/Approach'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Principles } from './components/sections/Principles'
import { Work } from './components/sections/Work'

function App() {
  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Work />
        <Approach />
        <Principles />
      </main>
      <Contact />
    </div>
  )
}

export default App
