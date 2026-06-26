import { useCallback, useEffect, useState } from "react";
import "../style/JobsPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/get`,
        { withCredentials: true }
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleApply(jobId) {
    try {
      setApplyingId(jobId);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/application/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      toast.success(response.data.message || "Job applied successfully");
      setJobs((currentJobs) => currentJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId("");
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const keyword = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(keyword) ||
      job.description?.toLowerCase().includes(keyword) ||
      job.location?.toLowerCase().includes(keyword) ||
      job.company?.companyName?.toLowerCase().includes(keyword)
    );
  });

  return (
    <section className="jobs-page">
      <div className="jobs-container">
        <div className="jobs-top">
          <div className="jobs-heading">
            <h1>Find Your Dream Job</h1>
            <p>Explore jobs posted by recruiters and apply directly on QuickHire.</p>
          </div>

          <div className="jobs-search-box">
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search jobs"
            />
          </div>
        </div>

        {loading ? (
          <div className="jobs-grid" aria-label="Loading jobs">
            {[1, 2, 3].map((item) => (
              <div className="job-card skeleton-card" key={item}>
                <span className="skeleton-line wide" />
                <span className="skeleton-line" />
                <span className="skeleton-line tall" />
                <span className="skeleton-line button" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="jobs-message error-message">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-jobs-box">
            <div className="empty-icon">Jobs</div>
            <h3>No available jobs</h3>
            <p>New matching roles will appear here as recruiters publish them.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-card-header">
                  <div>
                    <h2>{job.title}</h2>
                    <p className="company-name">
                      {job.company?.companyName || "No company"}
                    </p>
                  </div>

                  <span className={`job-status ${job.status}`}>
                    {job.status}
                  </span>
                </div>

                <div className="job-meta">
                  <span>{job.location || "No location"}</span>
                  <span>{job.jobType || "Not specified"}</span>
                  <span>Rs. {job.salary || 0}</span>
                </div>

                <p className="job-description">
                  {job.description?.length > 130
                    ? `${job.description.slice(0, 130)}...`
                    : job.description}
                </p>

                <div className="job-extra">
                  <p className="experience-text">
                    <strong>Experience:</strong> {job.experienceLevel ?? 0}
                  </p>

                  <div className="requirements-wrap">
                    {job.requirement?.length > 0 ? (
                      job.requirement.map((item, index) => (
                        <span key={index} className="requirement-chip">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="requirement-chip">No requirements added</span>
                    )}
                  </div>
                </div>

               <div className="job-actions split-actions">
  <Link
    to={`/jobs/${job._id}`}
    className="job-btn details-btn"
  >
    View Details
  </Link>

  {!user && (
    <Link
      to="/login"
      className="job-btn apply-btn"
    >
      Login to Apply
    </Link>
  )}

  {user?.role === "student" && (
    <button
      className="job-btn apply-btn"
      disabled={applyingId === job._id}
      onClick={() => handleApply(job._id)}
    >
      {applyingId === job._id ? "Applying..." : "Apply Job"}
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

