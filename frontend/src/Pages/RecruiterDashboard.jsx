import "../style/RecruiterDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const { user } = useAuth();

  const [jobCount, setJobCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const jobsRes = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/getadminJobs`,
        { withCredentials: true }
      );

      const jobs = jobsRes.data.jobs || [];

      setJobCount(jobs.length);

      let totalApplicants = 0;
      let totalOpenJobs = 0;
      let totalClosedJobs = 0;

      jobs.forEach((job) => {
        totalApplicants += job.applications?.length || 0;

        if (job.status === "open") totalOpenJobs += 1;
        if (job.status === "closed") totalClosedJobs += 1;
      });

      setApplicantCount(totalApplicants);
      setOpenJobs(totalOpenJobs);
      setClosedJobs(totalClosedJobs);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    }
  }

  return (
    <section className="recruiter-dashboard">
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-left">
            <p className="dashboard-badge">Recruiter Workspace</p>
            <h1>Welcome back, {user?.name || "Recruiter"} 👋</h1>
            <p>
              Manage your jobs, track applicants, and keep hiring organized from
              one place.
            </p>

            <div className="hero-buttons">
              <Link to="/recruiter/job/create" className="hero-btn primary-btn">
                Post New Job
              </Link>
              <Link to="/recruiter/jobs" className="hero-btn secondary-btn">
                View My Jobs
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="mini-card">
              <h3>{jobCount}</h3>
              <p>Total Jobs</p>
            </div>
            <div className="mini-card">
              <h3>{applicantCount}</h3>
              <p>Total Applicants</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card green-card">
            <div className="stat-icon">💼</div>
            <div>
              <h2>{jobCount}</h2>
              <p>Total Jobs</p>
            </div>
          </div>

          <div className="stat-card blue-card">
            <div className="stat-icon">🟢</div>
            <div>
              <h2>{openJobs}</h2>
              <p>Open Jobs</p>
            </div>
          </div>

          <div className="stat-card orange-card">
            <div className="stat-icon">🔒</div>
            <div>
              <h2>{closedJobs}</h2>
              <p>Closed Jobs</p>
            </div>
          </div>

          <div className="stat-card purple-card">
            <div className="stat-icon">👥</div>
            <div>
              <h2>{applicantCount}</h2>
              <p>Total Applicants</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/recruiter/job/create" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Post Job</h3>
              <p>Create and publish a new job opening.</p>
            </Link>

            <Link to="/recruiter/jobs" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Jobs</h3>
              <p>View all jobs you posted and close them if needed.</p>
            </Link>

            <Link to="/recruiter/companies" className="action-card">
              <div className="action-icon">🏢</div>
              <h3>Companies</h3>
              <p>Manage company profiles used for job postings.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}