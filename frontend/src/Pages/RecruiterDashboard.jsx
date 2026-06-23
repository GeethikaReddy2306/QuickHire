import { Link } from "react-router-dom";
import "../style/RecruiterDashboard.css";
import { useAuth } from "../context/AuthContext";

export default function RecruiterDashboard() {
  const { user } = useAuth();

  return (
    <section className="recruiter-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Recruiter Dashboard</h1>
          <p>
            Welcome back, <span>{user?.name}</span> 👋  
            Manage your companies, post jobs, and track applicants from here.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Companies</h3>
            <p>0</p>
          </div>

          <div className="dashboard-card">
            <h3>Jobs Posted</h3>
            <p>0</p>
          </div>

          <div className="dashboard-card">
            <h3>Total Applicants</h3>
            <p>0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <Link to="/recruiter/company/create" className="dashboard-btn">
            Add Company
          </Link>

          <Link to="/recruiter/job/create" className="dashboard-btn">
            Post New Job
          </Link>

          <Link to="/recruiter/jobs" className="dashboard-btn secondary-btn">
            View My Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}