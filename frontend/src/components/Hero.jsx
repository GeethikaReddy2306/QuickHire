import "../style/Hero.css";

export default function Hero() {
  return (
    <section id="hero">
      {/* Left Side */}
      <div className="hero-left">
        <p className="hero-badge">#1 Job Portal for Students & Recruiters</p>

        <h1 className="hero-title">
          Find Your Dream Job and Build Your Career with <span>QuickHire</span>
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
          />
          <button>Search Jobs</button>
        </div>

        <div className="hero-tags">
          <span>Frontend Developer</span>
          <span>Backend Developer</span>
          <span>Full Stack</span>
          <span>Internship</span>
          <span>Remote</span>
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
          <button>Apply Now</button>
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