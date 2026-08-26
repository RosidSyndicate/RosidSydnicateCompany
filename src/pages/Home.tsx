import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import Services from '../components/Services'
import Process from '../components/Process'
import ForeignContractor from '../components/ForeignContractor'
import Projects from '../components/Projects'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Process />
      <Services />
      <ForeignContractor />
      <Projects />
      <FAQ />
      <Contact />
    </>
  )
}
