import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../style/AppliedJobsPage.css";

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  async function fetchAppliedJobs() {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/application/get`,
        { withCredentials: true }
      );
      setApplications(response.data.application || []);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch applied jobs");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="applied-page">
      <div className="applied-container">
        <div className="applied-header">
          <h1>Applied Jobs</h1>
          <p>Track every role you applied to and follow your application status.</p>
        </div>

        {loading ? (
          <p className="applied-message">Loading applied jobs...</p>
        ) : error ? (
          <p className="applied-message error-message">{error}</p>
        ) : applications.length === 0 ? (
          <div className="empty-applied-box">
            <h3>No applications yet</h3>
            <p>Apply to jobs that match your skills and they will appear here.</p>
            <Link to="/jobs" className="browse-jobs-link">Browse Jobs</Link>
          </div>
        ) : (
          <div className="applied-grid">
            {applications.map((application) => {
              const job = application.job;

              return (
                <div className="applied-card" key={application._id}>
                  <div className="applied-top">
                    <div>
                      <p className="company-name">{job?.company?.companyName || "Company"}</p>
                      <h2>{job?.title || "Deleted job"}</h2>
                    </div>
                    <span className={`application-status ${application.status}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="applied-meta">
                    <span>{job?.location || "No location"}</span>
                    <span>{job?.jobType || "Not specified"}</span>
                    <span>Rs. {job?.salary || 0}</span>
                  </div>

                  <p className="applied-description">
                    {job?.description
                      ? job.description.length > 140
                        ? `${job.description.slice(0, 140)}...`
                        : job.description
                      : "This job is no longer available."}
                  </p>

                  {job?._id && (
                    <Link to={`/jobs/${job._id}`} className="view-job-link">
                      View Job
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
