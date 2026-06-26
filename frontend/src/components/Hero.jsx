import "../style/Hero.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  function handleSearch() {
    if (!keyword.trim()) {
      navigate("/jobs");
      return;
    }

    navigate(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <section id="hero">
      {/* Left Side */}
      <div className="hero-left">
        <p className="hero-badge">
          #1 Job Portal for Students & Recruiters
        </p>

        <h1 className="hero-title">
          Find Your Dream Job and Build Your Career with
          <span> QuickHire</span>
        </h1>

        <p className="hero-desc">
          Discover internships, fresher roles, and full-time opportunities from
          top companies. Build your profile, apply faster, and connect with
          recruiters in one place.
        </p>

        <div className="hero-search">
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleSearch}>
            Search Jobs
          </button>
        </div>

        <div className="hero-tags">
          <span onClick={() => navigate("/jobs?keyword=Frontend")}>
            Frontend Developer
          </span>

          <span onClick={() => navigate("/jobs?keyword=Backend")}>
            Backend Developer
          </span>

          <span onClick={() => navigate("/jobs?keyword=Full Stack")}>
            Full Stack
          </span>

          <span onClick={() => navigate("/jobs?keyword=Internship")}>
            Internship
          </span>

          <span onClick={() => navigate("/jobs?keyword=Remote")}>
            Remote
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-right">
        <div className="main-job-card">
          <p className="job-company">Google</p>

          <h3>Frontend Developer</h3>

          <p>Hyderabad, India</p>

          <div className="job-info">
            <span>₹8 LPA</span>
            <span>Full Time</span>
          </div>

          {!isAuthenticated ? (
            <button onClick={() => navigate("/login")}>
              Login to Apply
            </button>
          ) : user?.role === "student" ? (
            <button onClick={() => navigate("/jobs")}>
              Apply Now
            </button>
          ) : (
            <button onClick={() => navigate("/recruiter/job/create")}>
              Post a Job
            </button>
          )}
        </div>

        <div className="floating-card card-one">
          <h4>1,200+</h4>
          <p>Active Jobs</p>
        </div>

        <div className="floating-card card-two">
          <h4>500+</h4>
          <p>Companies Hiring</p>
        </div>
      </div>
    </section>
  );
}