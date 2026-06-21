import "../style/Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
          </li>
          <li>
            <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
          </li>
        </ul>

        <div className="buttons">
          <button id="login">Login</button>
          <button id="signup">SignUp</button>
        </div>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </div>
    </nav>
  );
}