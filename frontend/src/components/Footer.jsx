import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/Footer.css";

export default function Footer() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const protectedNavigate = (path) => {
    if (!isAuthenticated) {
      navigate("/access-denied");
      return;
    }

    navigate(path);
  };

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
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/jobs">Jobs</Link>
            </li>

            <li>
              <Link to="/browse">Browse</Link>
            </li>

            {!isAuthenticated ? (
              <li>
                <Link to="/login">Login</Link>
              </li>
            ) : (
              <li>
                <button
                  className="footer-link-btn"
                  onClick={() => protectedNavigate("/profile")}
                >
                  Profile
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Recruiters */}
        <div className="footer-links">
          <h3>For Recruiters</h3>

          <ul>
            <li>
              <button
                className="footer-link-btn"
                onClick={() => protectedNavigate("/recruiter/job/create")}
              >
                Post a Job
              </button>
            </li>

            <li>
              <button
                className="footer-link-btn"
                onClick={() => protectedNavigate("/recruiter/jobs")}
              >
                Manage Jobs
              </button>
            </li>

            <li>
              <button
                className="footer-link-btn"
                onClick={() => protectedNavigate("/recruiter/dashboard")}
              >
                View Applicants
              </button>
            </li>
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