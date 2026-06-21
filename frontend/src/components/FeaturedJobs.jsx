import "../style/FeaturedJobs.css";

export default function FeaturedJobs() {
  return (
    <section id="featured-jobs">
      <div className="featured-heading">
        <h2>Featured Jobs</h2>
        <p>Explore the latest openings from top companies hiring now.</p>
      </div>

      <div className="jobs-container">
        {/* Job Card 1 */}
        <div className="job-card">
          <p className="company-name">Google</p>
          <h3>Frontend Developer</h3>
          <p className="job-location">Hyderabad, India</p>

          <div className="job-tags">
            <span>React</span>
            <span>JavaScript</span>
            <span>Full Time</span>
          </div>

          <p className="salary">₹8 - ₹12 LPA</p>
          <button>View Details</button>
        </div>

        {/* Job Card 2 */}
        <div className="job-card">
          <p className="company-name">Amazon</p>
          <h3>Backend Developer</h3>
          <p className="job-location">Bangalore, India</p>

          <div className="job-tags">
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
          </div>

          <p className="salary">₹10 - ₹15 LPA</p>
          <button>View Details</button>
        </div>

        {/* Job Card 3 */}
        <div className="job-card">
          <p className="company-name">Microsoft</p>
          <h3>UI/UX Designer Intern</h3>
          <p className="job-location">Remote</p>

          <div className="job-tags">
            <span>Figma</span>
            <span>Internship</span>
            <span>Design</span>
          </div>

          <p className="salary">₹25,000 / month</p>
          <button>View Details</button>
        </div>
      </div>

      <div className="featured-btn">
        <button>Browse All Jobs</button>
      </div>
    </section>
  );
}