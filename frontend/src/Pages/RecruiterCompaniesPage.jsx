import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../style/RecruiterCompaniesPage.css";

export default function RecruiterCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/company/get`,
        { withCredentials: true }
      );

      setCompanies(response.data.companies || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch companies");
    }
  }

  return (
    <section className="recruiter-companies-page">
      <div className="recruiter-companies-container">
        <div className="companies-header">
          <div>
            <h1>My Companies</h1>
            <p>Manage the companies you created for posting jobs.</p>
          </div>

          <Link to="/recruiter/company/create" className="add-company-btn">
            + Add Company
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        {companies.length === 0 ? (
          <div className="empty-company-box">
            <h3>No companies found</h3>
            <p>You haven’t created any company yet.</p>
            <Link to="/recruiter/company/create" className="create-company-link">
              Create Company
            </Link>
          </div>
        ) : (
          <div className="companies-grid">
            {companies.map((company) => (
              <div className="company-card" key={company._id}>
                <div className="company-top">
                  <h2>{company.companyName}</h2>
                  <span className="company-badge">Recruiter Company</span>
                </div>

                <p className="company-location">
                  {company.location || "No location added"}
                </p>

                <p className="company-description">
                  {company.description
                    ? company.description.length > 120
                      ? company.description.slice(0, 120) + "..."
                      : company.description
                    : "No description added"}
                </p>

                <div className="company-links">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="company-website"
                    >
                      Visit Website
                    </a>
                  ) : (
                    <span className="no-website">No Website</span>
                  )}

                  <Link
                    to={`/recruiter/company/edit/${company._id}`}
                    className="edit-company-btn"
                  >
                    Edit Company
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}