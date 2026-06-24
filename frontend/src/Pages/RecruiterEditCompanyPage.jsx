import { useEffect, useState } from "react";
import "../style/RecruiterCreateCompanyPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function RecruiterEditCompanyPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  async function fetchCompanyDetails() {
    try {
      setFetchLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/company/get/${id}`,
        { withCredentials: true }
      );

      const company = response.data.company;

      setCompanyName(company.companyName || "");
      setDescription(company.description || "");
      setWebsite(company.website || "");
      setLocation(company.location || "");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch company details");
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleUpdateCompany(e) {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/company/update/${id}`,
        {
          companyName,
          description,
          website,
          location
        },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Company updated successfully");

      setTimeout(() => {
        navigate("/recruiter/companies");
      }, 1000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update company");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <section className="create-company-page">
        <div className="create-company-container">
          <div className="create-company-header">
            <h1>Edit Company</h1>
            <p>Loading company details...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="create-company-page">
      <div className="create-company-container">
        <div className="create-company-header">
          <h1>Edit Company</h1>
          <p>Update your company details here.</p>
        </div>

        <form className="create-company-form" onSubmit={handleUpdateCompany}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <label>Company Name</label>
            <input
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              rows="5"
              placeholder="Enter company description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Website</label>
            <input
              type="text"
              placeholder="Enter website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button type="submit" className="create-company-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Company"}
          </button>
        </form>
      </div>
    </section>
  );
}