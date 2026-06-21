import "../style/Footer.css";

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-container">
        {/* Left */}
        <div className="footer-about">
          <h2>
            Quick<span>Hire</span>
          </h2>
          <p>
            Your career starts here. Discover jobs, internships, and
            opportunities that match your skills.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Jobs</li>
            <li>Browse</li>
            <li>Login</li>
          </ul>
        </div>

        {/* Recruiter */}
        <div className="footer-links">
          <h3>For Recruiters</h3>
          <ul>
            <li>Post a Job</li>
            <li>Manage Jobs</li>
            <li>View Applicants</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>support@quickhire.com</p>
          <p>Hyderabad, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 QuickHire. All rights reserved.</p>
      </div>
    </footer>
  );
}