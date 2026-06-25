import "../style/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav id="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <h1>
          Quick<span>Hire</span>
        </h1>
      </Link>

      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <ul>
          {!isAuthenticated && (
            <>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/jobs" onClick={closeMenu}>Jobs</Link></li>
              <li><Link to="/browse" onClick={closeMenu}>Browse</Link></li>
            </>
          )}

          {isAuthenticated && user?.role === "student" && (
            <>
              
              <li><Link to="/jobs" onClick={closeMenu}>Jobs</Link></li>
              <li><Link to="/applied-jobs" onClick={closeMenu}>Applied Jobs</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
            </>
          )}

          {isAuthenticated && user?.role === "recruiter" && (
            <>
              <li><Link to="/recruiter/dashboard" onClick={closeMenu}>Dashboard</Link></li>
              <li><Link to="/recruiter/companies" onClick={closeMenu}>Companies</Link></li>
              <li><Link to="/recruiter/job/create" onClick={closeMenu}>Post Job</Link></li>
              <li><Link to="/recruiter/jobs" onClick={closeMenu}>My Jobs</Link></li>
            </>
          )}
        </ul>

        <div className="buttons">
          {!isAuthenticated ? (
            <>
              <Link to="/login"><button id="login" onClick={closeMenu}>Login</button></Link>
              <Link to="/signup"><button id="signup" onClick={closeMenu}>Sign Up</button></Link>
            </>
          ) : (
            <div className="profile-box">
              <span className="profile-name">Hi, {user?.name}</span>
              <button
                id="logout"
                onClick={() => {
                  logout();
                  closeMenu();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="hamburger"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "X" : "Menu"}
      </button>
    </nav>
  );
}
