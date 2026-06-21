import Hero from "../components/Hero"
import StatsSection from "../components/StatsSection"
import FeaturedJobs from "../components/FeaturedJobs"
import TopCompanies from "./TopCompanies"
import WhyChoose from "../components/WhyChoose"
export default function HomePage() {
  return (
    <div>
     <Hero/>
      <StatsSection />
      <FeaturedJobs/>
       <TopCompanies />
       <WhyChoose/>
    </div>
  )
}
