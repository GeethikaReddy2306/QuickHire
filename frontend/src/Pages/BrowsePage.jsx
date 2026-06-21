import "../style/BrowsePage.css";

export default function BrowsePage() {
  return (
    <>
    

      <section id="browse-page">
        {/* Header */}
        <div className="browse-header">
          <h1>Explore Opportunities That Match Your Goals</h1>
          <p>
            Browse jobs by category, discover top companies, and explore career
            paths designed for students, freshers, and professionals.
          </p>
        </div>

        {/* Categories Section */}
        <section className="browse-section">
          <div className="section-heading">
            <h2>Popular Categories</h2>
            <p>Explore jobs based on your interests and skills.</p>
          </div>

          <div className="browse-grid">
            <div className="browse-card">
              <h3>Frontend Development</h3>
              <p>React, JavaScript, UI-focused roles</p>
              <span>240+ Jobs</span>
            </div>

            <div className="browse-card">
              <h3>Backend Development</h3>
              <p>Node.js, APIs, Databases, Server-side roles</p>
              <span>180+ Jobs</span>
            </div>

            <div className="browse-card">
              <h3>Full Stack Development</h3>
              <p>MERN, end-to-end web development roles</p>
              <span>150+ Jobs</span>
            </div>

            <div className="browse-card">
              <h3>UI / UX Design</h3>
              <p>Figma, Product Design, Creative roles</p>
              <span>90+ Jobs</span>
            </div>

            <div className="browse-card">
              <h3>Data & Analytics</h3>
              <p>SQL, Python, Power BI, Data roles</p>
              <span>130+ Jobs</span>
            </div>

            <div className="browse-card">
              <h3>Cloud & DevOps</h3>
              <p>AWS, Azure, CI/CD, Deployment roles</p>
              <span>70+ Jobs</span>
            </div>
          </div>
        </section>

        {/* Companies Section */}
        <section className="browse-section">
          <div className="section-heading">
            <h2>Browse by Top Companies</h2>
            <p>Discover opportunities from trusted hiring partners.</p>
          </div>

          <div className="browse-grid companies-grid">
            <div className="company-box">
              <h3>Google</h3>
              <p>Technology • 120 Open Roles</p>
              <button>View Jobs</button>
            </div>

            <div className="company-box">
              <h3>Microsoft</h3>
              <p>Software & Cloud • 85 Open Roles</p>
              <button>View Jobs</button>
            </div>

            <div className="company-box">
              <h3>Amazon</h3>
              <p>E-Commerce & Cloud • 140 Open Roles</p>
              <button>View Jobs</button>
            </div>

            <div className="company-box">
              <h3>TCS</h3>
              <p>IT Services • 95 Open Roles</p>
              <button>View Jobs</button>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="browse-section">
          <div className="section-heading">
            <h2>Explore Career Paths</h2>
            <p>Collections curated for different job seekers.</p>
          </div>

          <div className="career-paths">
            <div className="path-card">
              <h3>Internships</h3>
              <p>
                Find internships in development, design, analytics, and more to
                kickstart your career.
              </p>
              <button>Explore Internships</button>
            </div>

            <div className="path-card">
              <h3>Fresher Jobs</h3>
              <p>
                Entry-level opportunities for recent graduates looking for their
                first full-time role.
              </p>
              <button>Explore Fresher Jobs</button>
            </div>

            <div className="path-card">
              <h3>Remote Opportunities</h3>
              <p>
                Browse flexible remote jobs and work-from-home roles across
                different domains.
              </p>
              <button>Explore Remote Jobs</button>
            </div>
          </div>
        </section>
      </section>

     
    </>
  );
}