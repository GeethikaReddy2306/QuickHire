import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../style/JobDetailsPage.css";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  async function fetchJob() {
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
  }

  async function handleApply() {
    try {
      setApplying(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/application/apply/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message || "Applied successfully");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return <p className="details-message">Loading job details...</p>;
  }

  if (error || !job) {
    return <p className="details-message error-message">{error || "Job not found"}</p>;
  }

  return (
    <section className="job-details-page">
      <div className="job-details-container">
        <Link to="/jobs" className="back-link">Back to Jobs</Link>

        <div className="job-details-panel">
          <div className="details-header">
            <div>
              <p className="company-name">{job.company?.companyName || "Company"}</p>
              <h1>{job.title}</h1>
              <div className="details-meta">
                <span>{job.location}</span>
                <span>{job.jobType}</span>
                <span>Rs. {job.salary}</span>
                <span>{job.experienceLevel}</span>
              </div>
            </div>
            <span className={`job-status ${job.status}`}>{job.status}</span>
          </div>

          <div className="details-section">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </div>

          <div className="details-section">
            <h2>Requirements</h2>
            <div className="requirements-wrap">
              {job.requirement?.length > 0 ? (
                job.requirement.map((item, index) => (
                  <span className="requirement-chip" key={index}>{item}</span>
                ))
              ) : (
                <span className="requirement-chip">No requirements added</span>
              )}
            </div>
          </div>

          <div className="details-section company-summary">
            <h2>Company</h2>
            <p>{job.company?.description || "No company description added yet."}</p>
            <p>{job.company?.location || job.location}</p>
            {job.company?.website && (
              <a href={job.company.website} target="_blank" rel="noreferrer">
                Visit Website
              </a>
            )}
          </div>

          <div className="details-actions">
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
      </div>
    </section>
  );
}
