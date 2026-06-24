import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/RecruiterApplicantsPage.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function RecruiterApplicantsPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  async function fetchApplicants() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/application/${jobId}/applicants`,
        { withCredentials: true }
      );

      setJob(response.data.job);
      setApplications(response.data.job.applications || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch applicants");
    }
  }

  async function handleStatusUpdate(applicationId, status) {
    try {
      setLoadingId(applicationId);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/application/status/${applicationId}/update`,
        { status },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Status updated successfully");
      fetchApplicants();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <section className="recruiter-applicants-page">
      <div className="recruiter-applicants-container">
        <div className="applicants-header">
          <h1>Applicants</h1>
          <p>
            {job
              ? `Applicants for ${job.title} at ${job.company?.companyName || "Company"}`
              : "Loading applicants..."}
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {applications.length === 0 ? (
          <div className="empty-applicants-box">
            <h3>No applicants yet</h3>
            <p>No one has applied for this job yet.</p>
          </div>
        ) : (
          <div className="applicants-grid">
            {applications.map((application) => {
              const applicant = application.applicant;
              const currentStatus = application.status;

              return (
                <div className="applicant-card" key={application._id}>
                  <div className="applicant-top">
                    <div>
                      <h2>{applicant?.name}</h2>
                      <p className="applicant-email">{applicant?.email}</p>
                      <p className="applicant-phone">{applicant?.phoneNumber}</p>
                    </div>

                    <span className={`application-status ${currentStatus}`}>
                      {currentStatus}
                    </span>
                  </div>

                  <div className="applicant-section">
                    <h4>Bio</h4>
                    <p>{applicant?.profile?.bio || "No bio added"}</p>
                  </div>

                  <div className="applicant-section">
                    <h4>Skills</h4>
                    <div className="skills-wrap">
                      {applicant?.profile?.skills?.length > 0 ? (
                        applicant.profile.skills.map((skill, index) => (
                          <span key={index} className="skill-badge">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p>No skills added</p>
                      )}
                    </div>
                  </div>

                  <div className="applicant-section">
                    <h4>Resume</h4>
                    {applicant?.profile?.resume ? (
                      <a
                        href={applicant.profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                      >
                        {applicant.profile.resumeOriginalName || "View Resume"}
                      </a>
                    ) : (
                      <p>No resume uploaded</p>
                    )}
                  </div>

                  <div className="applicant-actions">
                    <button
                      className="accept-btn"
                      disabled={loadingId === application._id}
                      onClick={() =>
                        handleStatusUpdate(application._id, "accepted")
                      }
                    >
                      {loadingId === application._id ? "Updating..." : "Accept"}
                    </button>

                    <button
                      className="reject-btn"
                      disabled={loadingId === application._id}
                      onClick={() =>
                        handleStatusUpdate(application._id, "rejected")
                      }
                    >
                      {loadingId === application._id ? "Updating..." : "Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}