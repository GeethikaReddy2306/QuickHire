import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../style/JobDetailsPage.css";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/job/get/${id}`,
        { withCredentials: true }
      );
      setJob(response.data.job);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  async function handleApply() {
    try {
      setApplying(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/application/apply/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message || "Job applied successfully");
      navigate("/applied-jobs");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <section className="job-details-page">
        <div className="job-details-container details-skeleton">
          <span className="skeleton-line wide" />
          <span className="skeleton-line title" />
          <div className="details-card-grid">
            {[1, 2, 3].map((item) => <span className="skeleton-info-card" key={item} />)}
          </div>
        </div>
      </section>
    );
  }

  if (error || !job) {
    return <p className="details-message error-message">{error || "Job not found"}</p>;
  }

  return (
    <section className="job-details-page">
      <div className="job-details-container">
        <Link to="/jobs" className="back-link">Back to Jobs</Link>

        <div className="job-hero-panel">
          <div className="job-hero-copy">
            <span className="eyebrow-badge">{job.company?.companyName || "Company"}</span>
            <h1>{job.title}</h1>
            <p>{job.description}</p>
            <div className="details-meta">
              <span>{job.location}</span>
              <span>{job.jobType}</span>
              <span>{job.experienceLevel}</span>
            </div>
          </div>
          <div className="apply-card">
            <span className={`job-status ${job.status}`}>{job.status}</span>
            <strong>Rs. {job.salary}</strong>
            <p>Annual package or recruiter-stated compensation.</p>
            {user?.role === "student" && job.status === "open" ? (
              <button className="apply-detail-btn" onClick={handleApply} disabled={applying}>
                {applying ? "Applying..." : "Apply Now"}
              </button>
            ) : (
              <button className="apply-detail-btn disabled" disabled>
                {job.status === "closed" ? "Job Closed" : "Recruiter View"}
              </button>
            )}
          </div>
        </div>

        <div className="details-card-grid">
          <div className="info-card">
            <span>Location</span>
            <strong>{job.location}</strong>
          </div>
          <div className="info-card">
            <span>Job Type</span>
            <strong>{job.jobType}</strong>
          </div>
          <div className="info-card">
            <span>Positions</span>
            <strong>{job.position}</strong>
          </div>
          <div className="info-card">
            <span>Experience</span>
            <strong>{job.experienceLevel}</strong>
          </div>
        </div>

        <div className="details-two-column">
          <section className="details-section requirements-section">
            <div className="section-heading">
              <h2>Requirements</h2>
              <p>Skills and expectations for this role.</p>
            </div>
            <div className="requirements-wrap">
              {job.requirement?.length > 0 ? (
                job.requirement.map((item, index) => (
                  <span className="requirement-chip" key={index}>{item}</span>
                ))
              ) : (
                <span className="requirement-chip">No requirements added</span>
              )}
            </div>
          </section>

          <section className="details-section company-summary">
            <div className="company-mark">
              {job.company?.logo ? <img src={job.company.logo} alt="" /> : <span>{job.company?.companyName?.[0] || "C"}</span>}
            </div>
            <div className="section-heading">
              <h2>{job.company?.companyName || "Company"}</h2>
              <p>{job.company?.description || "No company description added yet."}</p>
            </div>
            <div className="company-facts">
              <span>{job.company?.location || job.location}</span>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer">Visit Website</a>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

