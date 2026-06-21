
import "../style/Jobs.css";

export default function JobsPage() {
  return (
    <>
      

      <section id="jobs-page">
        {/* Top Heading */}
        <div className="jobs-header">
          <h1>Find Your Next Opportunity</h1>
          <p>
            Explore internships, fresher roles, and full-time jobs from top
            companies.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="jobs-filter-bar">
          <input
            type="text"
            placeholder="Search by title, skill, or company"
          />

          <select>
            <option>Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          <select>
            <option>Location</option>
            <option>Hyderabad</option>
            <option>Bangalore</option>
            <option>Chennai</option>
            <option>Remote</option>
          </select>

          <select>
            <option>Experience</option>
            <option>Fresher</option>
            <option>1-2 Years</option>
            <option>3+ Years</option>
          </select>

          <button>Apply Filters</button>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid">
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

          {/* Job Card 4 */}
          <div className="job-card">
            <p className="company-name">TCS</p>
            <h3>Full Stack Developer</h3>
            <p className="job-location">Chennai, India</p>

            <div className="job-tags">
              <span>React</span>
              <span>Node.js</span>
              <span>MongoDB</span>
            </div>

            <p className="salary">₹6 - ₹10 LPA</p>
            <button>View Details</button>
          </div>

          {/* Job Card 5 */}
          <div className="job-card">
            <p className="company-name">Infosys</p>
            <h3>Data Analyst</h3>
            <p className="job-location">Pune, India</p>

            <div className="job-tags">
              <span>SQL</span>
              <span>Python</span>
              <span>Analytics</span>
            </div>

            <p className="salary">₹5 - ₹8 LPA</p>
            <button>View Details</button>
          </div>

          {/* Job Card 6 */}
          <div className="job-card">
            <p className="company-name">Startup Hub</p>
            <h3>React Developer Intern</h3>
            <p className="job-location">Remote</p>

            <div className="job-tags">
              <span>React</span>
              <span>Internship</span>
              <span>Frontend</span>
            </div>

            <p className="salary">₹20,000 / month</p>
            <button>View Details</button>
          </div>
        </div>
      </section>

      
    </>
  );
}
