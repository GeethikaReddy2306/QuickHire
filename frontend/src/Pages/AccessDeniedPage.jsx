import { Link } from "react-router-dom";
import "../style/AccessDeniedPage.css";

export default function AccessDeniedPage() {
  return (
    <div className="access-page">
      <div className="access-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="Access Denied"
        />

        <h1>Access Denied</h1>

        <p>
          This page is available only for authenticated users.
          <br />
          Please login to continue using <strong>QuickHire</strong>.
        </p>

        <div className="access-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/" className="home-btn">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}