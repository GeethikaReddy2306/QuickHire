import "../style/WhyChoose.css";

export default function WhyChoose() {
  return (
    <section id="why-choose">
      <div className="why-heading">
        <h2>Why Choose QuickHire?</h2>
        <p>
          Everything you need to search, apply, and get hired faster in one
          place.
        </p>
      </div>

      <div className="why-container">
        {/* Card 1 */}
        <div className="why-card">
          <div className="why-icon">🔎</div>
          <h3>Smart Job Search</h3>
          <p>
            Find jobs by title, skill, company, location, and experience level
            with powerful filters.
          </p>
        </div>

        {/* Card 2 */}
        <div className="why-card">
          <div className="why-icon">📄</div>
          <h3>Easy Applications</h3>
          <p>
            Create your profile once, upload your resume, and apply to multiple
            jobs in just a few clicks.
          </p>
        </div>

        {/* Card 3 */}
        <div className="why-card">
          <div className="why-icon">🤝</div>
          <h3>Recruiter Connections</h3>
          <p>
            Get discovered by recruiters and track your application status in
            one place without confusion.
          </p>
        </div>
      </div>
    </section>
  );
}