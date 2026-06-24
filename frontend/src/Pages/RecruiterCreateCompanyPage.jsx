import { useState } from "react";
import "../style/RecruiterCreateCompanyPage.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RecruiterCreateCompanyPage() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateCompany(e) {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/company/register`,
        {
          companyName,
          description,
          website,
          location
        },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Company created successfully");

      setCompanyName("");
      setDescription("");
      setWebsite("");
      setLocation("");

      setTimeout(() => {
        navigate("/recruiter/companies");
      }, 1000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="create-company-page">
      <div className="create-company-container">
        <div className="create-company-header">
          <h1>Add Your Company</h1>
          <p>Create your company profile before posting jobs on QuickHire.</p>
        </div>

        <form className="create-company-form" onSubmit={handleCreateCompany}>
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
            {loading ? "Creating..." : "Create Company"}
          </button>
        </form>
      </div>
    </section>
  );
}