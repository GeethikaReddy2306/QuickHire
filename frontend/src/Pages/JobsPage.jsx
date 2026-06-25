import { useEffect, useState } from "react";
import "../style/JobsPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/get`,
        { withCredentials: true }
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(jobId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/application/apply/${jobId}`,
        { withCredentials: true }
      );

      toast.success(response.data.message || "Applied successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to apply");
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
            />
          </div>
        </div>

        {loading ? (
          <p className="jobs-message">Loading jobs...</p>
        ) : error ? (
          <p className="jobs-message error-message">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-jobs-box">
            <h3>No jobs found</h3>
            <p>There are no jobs matching your search right now.</p>
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
                  <span>₹{job.salary || 0}</span>
                </div>

                <p className="job-description">
                  {job.description?.length > 130
                    ? job.description.slice(0, 130) + "..."
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

                <div className="job-actions">
                  {user?.role === "student" ? (
                    job.status === "closed" ? (
                      <button className="job-btn closed-btn" disabled>
                        Job Closed
                      </button>
                    ) : (
                      <button
                        className="job-btn apply-btn"
                        onClick={() => handleApply(job._id)}
                      >
                        Apply Job
                      </button>
                    )
                  ) : (
                    <button className="job-btn closed-btn" disabled>
                      Recruiter View
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