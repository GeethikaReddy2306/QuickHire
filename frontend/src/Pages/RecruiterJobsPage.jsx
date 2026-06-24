import { useEffect, useState } from "react";
import "../style/RecruiterJobsPage.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  async function fetchRecruiterJobs() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/getadminJobs`,
        { withCredentials: true }
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch recruiter jobs");
    }
  }

  async function handleCloseJob(jobId) {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/job/close/${jobId}`,
        {},
        { withCredentials: true }
      );

      toast.success(response.data.message || "Job closed successfully");
      fetchRecruiterJobs();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to close job");
    }
  }

  return (
    <section className="recruiter-jobs-page">
      <div className="recruiter-jobs-container">
        <div className="recruiter-jobs-header">
          <h1>My Posted Jobs</h1>
          <p>Manage all jobs posted by you and view applicants.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {jobs.length === 0 ? (
          <div className="empty-jobs-box">
            <h3>No jobs posted yet</h3>
            <p>Start by posting your first job opening.</p>
            <Link to="/recruiter/job/create" className="post-job-link">
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-top">
                  <h2>{job.title}</h2>
                  <span className={`job-status ${job.status}`}>
                    {job.status}
                  </span>
                </div>

                <p className="company-name">
                  {job.company?.companyName || "No Company"}
                </p>

                <div className="job-info">
                  <span>{job.location}</span>
                  <span>{job.jobType}</span>
                  <span>₹{job.salary}</span>
                </div>

                <p className="job-description">
                  {job.description.length > 120
                    ? job.description.slice(0, 120) + "..."
                    : job.description}
                </p>

                <div className="job-footer">
                  <span>Experience: {job.experienceLevel}</span>
                  <span>Applicants: {job.applications?.length || 0}</span>
                </div>

                <div className="job-actions">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="view-applicants-btn"
                  >
                    View Applicants
                  </Link>

                  {job.status === "open" ? (
                    <button
                      className="close-job-btn"
                      onClick={() => handleCloseJob(job._id)}
                    >
                      Close Job
                    </button>
                  ) : (
                    <button className="closed-btn" disabled>
                      Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}