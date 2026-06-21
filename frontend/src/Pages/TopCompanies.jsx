import "../style/TopCompanies.css";

export default function TopCompanies() {
  return (
    <section id="top-companies">
      <div className="companies-heading">
        <h2>Top Companies Hiring</h2>
        <p>
          Discover opportunities from leading companies across different
          industries.
        </p>
      </div>

      <div className="companies-container">
        {/* Company Card 1 */}
        <div className="company-card">
          <h3>Google</h3>
          <p>120 Open Roles</p>
          <span>Technology</span>
          <button>View Jobs</button>
        </div>

        {/* Company Card 2 */}
        <div className="company-card">
          <h3>Microsoft</h3>
          <p>85 Open Roles</p>
          <span>Software & Cloud</span>
          <button>View Jobs</button>
        </div>

        {/* Company Card 3 */}
        <div className="company-card">
          <h3>Amazon</h3>
          <p>140 Open Roles</p>
          <span>E-Commerce & Cloud</span>
          <button>View Jobs</button>
        </div>

        {/* Company Card 4 */}
        <div className="company-card">
          <h3>TCS</h3>
          <p>95 Open Roles</p>
          <span>IT Services</span>
          <button>View Jobs</button>
        </div>
      </div>
    </section>
  );
}