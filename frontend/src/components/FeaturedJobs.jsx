import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../style/FeaturedJobs.css";

const fallbackJobs = [
  {
    _id: "fallback-1",
    company: { companyName: "Google" },
    title: "Frontend Developer",
    location: "Hyderabad, India",
    requirement: ["React", "JavaScript", "Full Time"],
    salary: "8 - 12 LPA"
  },
  {
    _id: "fallback-2",
    company: { companyName: "Amazon" },
    title: "Backend Developer",
    location: "Bangalore, India",
    requirement: ["Node.js", "Express", "MongoDB"],
    salary: "10 - 15 LPA"
  },
  {
    _id: "fallback-3",
    company: { companyName: "Microsoft" },
    title: "UI/UX Designer Intern",
    location: "Remote",
    requirement: ["Figma", "Internship", "Design"],
    salary: "25,000 / month"
  }
];

export default function FeaturedJobs() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState(fallbackJobs);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchFeaturedJobs() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/job/get`,
          { withCredentials: true }
        );
        setJobs((response.data.jobs || []).slice(0, 3));
      } catch (error) {
        console.log("Featured jobs fetch error:", error);
      }
    }

    fetchFeaturedJobs();
  }, [isAuthenticated]);

  return (
    <section id="featured-jobs">
      <div className="featured-heading">
        <h2>Featured Jobs</h2>
        <p>Explore the latest openings from companies hiring now.</p>
      </div>

      <div className="jobs-container">
        {jobs.map((job) => (
          <div className="job-card" key={job._id}>
            <p className="company-name">{job.company?.companyName || "Company"}</p>
            <h3>{job.title}</h3>
            <p className="job-location">{job.location}</p>

            <div className="job-tags">
              {(job.requirement || []).slice(0, 3).map((item, index) => (
                <span key={`${job._id}-${index}`}>{item}</span>
              ))}
            </div>

            <p className="salary">Rs. {job.salary}</p>
            {String(job._id).startsWith("fallback") ? (
              <Link to="/jobs" className="featured-card-btn">View Jobs</Link>
            ) : (
              <Link to={`/jobs/${job._id}`} className="featured-card-btn">View Details</Link>
            )}
          </div>
        ))}
      </div>

      <div className="featured-btn">
        <Link to="/jobs">Browse All Jobs</Link>
      </div>
    </section>
  );
}
