import "../style/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav id="navbar">
      {/* Logo */}
      <div className="logo">
        <h1>
          Quick<span>Hire</span>
        </h1>
      </div>

      {/* Menu Wrapper */}
      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <ul>
          {/* If user not logged in */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
              </li>
              <li>
                <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
              </li>
            </>
          )}

          {/* Student Navbar */}
          {isAuthenticated && user?.role === "student" && (
            <>
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
              </li>
              <li>
                <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
              </li>
            </>
          )}

          {/* Recruiter Navbar */}
          {isAuthenticated && user?.role === "recruiter" && (
            <>
              <li>
                <Link to="/recruiter/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/companies" onClick={() => setMenuOpen(false)}>
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/recruiter/job/create" onClick={() => setMenuOpen(false)}>
                  Post Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs" onClick={() => setMenuOpen(false)}>
                  My Jobs
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="buttons">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button id="login" onClick={() => setMenuOpen(false)}>Login</button>
              </Link>

              <Link to="/signup">
                <button id="signup" onClick={() => setMenuOpen(false)}>Sign Up</button>
              </Link>
            </>
          ) : (
            <div className="profile-box">
              <span className="profile-name">Hi, {user?.name}</span>

              <button
                id="logout"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </div>
    </nav>
  );
}