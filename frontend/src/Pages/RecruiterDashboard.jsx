import "../style/RecruiterDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const axisChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 100,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#344054",
        boxWidth: 10,
        usePointStyle: true,
        font: { weight: "bold" }
      }
    }
  },
  scales: {
    x: { ticks: { color: "#667085", maxRotation: 0 }, grid: { display: false } },
    y: { beginAtZero: true, ticks: { color: "#667085", precision: 0 }, grid: { color: "#edf1e9" } }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 100,
  cutout: "68%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#344054",
        boxWidth: 10,
        usePointStyle: true,
        font: { weight: "bold" }
      }
    }
  }
};

function shortLabel(label = "") {
  return label.length > 18 ? `${label.slice(0, 18)}...` : label;
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const jobsRes = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/admin`,
        { withCredentials: true }
      );

      const recruiterJobs = jobsRes.data.jobs || [];
      setJobs(recruiterJobs);

      const applicantResults = await Promise.all(
        recruiterJobs.map(async (job) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/api/application/${job._id}/applicants`,
              { withCredentials: true }
            );

            return (response.data.job?.applications || []).map((application) => ({
              ...application,
              jobTitle: job.title,
              companyName: job.company?.companyName || "Company"
            }));
          } catch (error) {
            console.log("Applicant fetch error:", error);
            return [];
          }
        })
      );

      setApplications(applicantResults.flat());
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const openJobs = jobs.filter((job) => job.status === "open").length;
    const closedJobs = jobs.filter((job) => job.status === "closed").length;
    const accepted = applications.filter((app) => app.status === "accepted").length;
    const rejected = applications.filter((app) => app.status === "rejected").length;
    const pending = applications.filter((app) => app.status === "pending").length;

    return {
      totalJobs: jobs.length,
      openJobs,
      closedJobs,
      totalApplications: applications.length,
      accepted,
      rejected,
      pending
    };
  }, [jobs, applications]);

  const openClosedData = {
    labels: ["Open", "Closed"],
    datasets: [{
      data: [stats.openJobs, stats.closedJobs],
      backgroundColor: ["#7f8f78", "#d98f76"],
      borderWidth: 0
    }]
  };

  const statusData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [{
      data: [stats.pending, stats.accepted, stats.rejected],
      backgroundColor: ["#d9b96f", "#7f8f78", "#d98f76"],
      borderWidth: 0
    }]
  };

  const topJobs = jobs.slice(0, 6);
  const applicationsPerJobData = {
    labels: topJobs.map((job) => shortLabel(job.title)),
    datasets: [{
      label: "Applications",
      data: topJobs.map((job) => job.applications?.length || 0),
      backgroundColor: "#7f8f78",
      borderRadius: 8,
      maxBarThickness: 46
    }]
  };

  const monthlyApplicationsData = useMemo(() => {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);

    applications.forEach((application) => {
      const month = new Date(application.createdAt).getMonth();
      if (!Number.isNaN(month)) counts[month] += 1;
    });

    return {
      labels: monthLabels,
      datasets: [{
        label: "Applications",
        data: counts,
        borderColor: "#7f8f78",
        backgroundColor: "rgba(127, 143, 120, 0.16)",
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }]
    };
  }, [applications]);

  const recentJobs = jobs.slice(0, 4);
  const recentApplicants = applications.slice(0, 5);

  return (
    <section className="recruiter-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-hero">
          <div className="hero-left">
            <p className="dashboard-badge">Recruiter Workspace</p>
            <h1>Welcome back, {user?.name || "Recruiter"}</h1>
            <p>Track job performance, applicant status, and hiring activity from one modern dashboard.</p>
            <div className="hero-buttons">
              <Link to="/recruiter/job/create" className="hero-btn primary-btn">Post New Job</Link>
              <Link to="/recruiter/jobs" className="hero-btn secondary-btn">View My Jobs</Link>
            </div>
          </div>
          <div className="hero-right dashboard-scorecard">
            <span>Total Applications</span>
            <strong>{stats.totalApplications}</strong>
            <p>{stats.pending} pending decisions</p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading-grid">
            {[1, 2, 3, 4].map((item) => <span className="dashboard-skeleton" key={item} />)}
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card"><span>Total Jobs</span><strong>{stats.totalJobs}</strong></div>
              <div className="stat-card"><span>Open Jobs</span><strong>{stats.openJobs}</strong></div>
              <div className="stat-card"><span>Closed Jobs</span><strong>{stats.closedJobs}</strong></div>
              <div className="stat-card"><span>Applicants</span><strong>{stats.totalApplications}</strong></div>
            </div>

            <div className="dashboard-chart-grid">
              <div className="chart-card compact-chart">
                <h2>Open vs Closed</h2>
                <div className="chart-shell doughnut-shell">
                  <Doughnut data={openClosedData} options={doughnutOptions} />
                </div>
              </div>
              <div className="chart-card compact-chart">
                <h2>Application Status</h2>
                <div className="chart-shell doughnut-shell">
                  <Doughnut data={statusData} options={doughnutOptions} />
                </div>
              </div>
              <div className="chart-card wide-chart">
                <h2>Applications per Job</h2>
                <div className="chart-shell">
                  <Bar data={applicationsPerJobData} options={axisChartOptions} />
                </div>
              </div>
              <div className="chart-card wide-chart">
                <h2>Monthly Applications</h2>
                <div className="chart-shell">
                  <Line data={monthlyApplicationsData} options={axisChartOptions} />
                </div>
              </div>
            </div>

            <div className="dashboard-lists-grid">
              <div className="dashboard-list-card">
                <div className="list-heading">
                  <h2>Recent Jobs</h2>
                  <Link to="/recruiter/jobs">View all</Link>
                </div>
                {recentJobs.length === 0 ? (
                  <p className="empty-dashboard-copy">No jobs posted yet.</p>
                ) : recentJobs.map((job) => (
                  <div className="dashboard-list-row" key={job._id}>
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.company?.companyName || "Company"}</p>
                    </div>
                    <span className={`job-status ${job.status || "open"}`}>{job.status || "open"}</span>
                  </div>
                ))}
              </div>

              <div className="dashboard-list-card">
                <div className="list-heading">
                  <h2>Recent Applicants</h2>
                </div>
                {recentApplicants.length === 0 ? (
                  <p className="empty-dashboard-copy">No applicants yet.</p>
                ) : recentApplicants.map((application) => (
                  <div className="dashboard-list-row" key={application._id}>
                    <div>
                      <strong>{application.applicant?.name || "Applicant"}</strong>
                      <p>{application.jobTitle}</p>
                    </div>
                    <span className={`application-status ${application.status}`}>{application.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
