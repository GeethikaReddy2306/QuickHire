import Hero from "../components/Hero"
import StatsSection from "../components/StatsSection"
import FeaturedJobs from "../components/FeaturedJobs"

import WhyChoose from "../components/WhyChoose"
export default function HomePage() {
  return (
    <div>
     <Hero/>
      <StatsSection />
      <FeaturedJobs/>
       
       <WhyChoose/>
    </div>
  )
}
