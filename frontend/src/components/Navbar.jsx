import "../style/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

function initials(name = "U") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setProfileOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login");
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
              <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
              <li><Link to="/jobs" onClick={closeMenu}>Jobs</Link></li>
              <li><Link to="/applied-jobs" onClick={closeMenu}>Applied Jobs</Link></li>
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
            <div className="profile-menu-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="profile-avatar-btn"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
              >
                {user?.profile?.photo ? (
                  <img src={user.profile.photo} alt="" />
                ) : (
                  <span>{initials(user?.name)}</span>
                )}
              </button>

              <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>
                <div className="dropdown-user">
                  <div className="dropdown-photo">
                    {user?.profile?.photo ? <img src={user.profile.photo} alt="" /> : <span>{initials(user?.name)}</span>}
                  </div>
                  <div>
                    <strong>{user?.name}</strong>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <Link to="/profile" onClick={closeMenu}>Profile</Link>
                {user?.role === "student" && <Link to="/applied-jobs" onClick={closeMenu}>Applied Jobs</Link>}
                <Link to="/profile" onClick={closeMenu}>Settings</Link>
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
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
