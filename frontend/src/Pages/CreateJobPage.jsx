import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CreateJobPage.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // fetch recruiter companies
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/company/get`,
          { withCredentials: true }
        );
        setCompanies(response.data.companies || []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCompanies();
  }, []);

  async function handleCreateJob(e) {
    e.preventDefault();
    setError("");

    if (
      !title ||
      !description ||
      !requirement ||
      !experienceLevel ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      setError("Please fill all job details");
      return;
    }

    try {
      const jobData = {
        title,
        description,
        requirement,
        experienceLevel,
        salary,
        location,
        jobType,
        position,
        company
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/job/post`,
        jobData,
        { withCredentials: true }
      );

      console.log(response.data);
      toast.success("Job posted successfully!");

      setTitle("");
      setDescription("");
      setRequirement("");
      setExperienceLevel("");
      setSalary("");
      setLocation("");
      setJobType("");
      setPosition("");
      setCompany("");

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1200);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to post job");
    }
  }

  return (
    <section className="create-job-page">
      <div className="create-job-card">
        <h2>Post a New Job</h2>
        <p className="job-subtext">
          Fill in the details below to publish a job opening on QuickHire.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form className="job-form" onSubmit={handleCreateJob}>
          <div className="form-grid">
            <div className="input-group">
              <label>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Frontend Developer Intern"
              />
            </div>

            <div className="input-group">
              <label>Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Frontend Intern"
              />
            </div>

            <div className="input-group full-width">
              <label>Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write job description"
              />
            </div>

            <div className="input-group full-width">
              <label>Requirements</label>
              <input
                type="text"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="React, JavaScript, CSS"
              />
            </div>

            <div className="input-group">
              <label>Experience Level</label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="0-1 years"
              />
            </div>

            <div className="input-group">
              <label>Salary</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="25000"
              />
            </div>

            <div className="input-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad"
              />
            </div>

            <div className="input-group">
              <label>Job Type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Select Company</label>
              <select value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="">Select Company</option>
                {companies.map((comp) => (
                  <option key={comp._id} value={comp._id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="create-job-btn">
            Post Job
          </button>
        </form>
      </div>
    </section>
  );
}