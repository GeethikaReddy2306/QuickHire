import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CreateCompanyPage.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateCompanyPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleCreateCompany(e) {
    e.preventDefault();
    setError("");

    if (!name || !description || !website || !location) {
      setError("Please fill all company details");
      return;
    }

    try {
      const companyData = {
        name,
        description,
        website,
        location
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/company/register`,
        companyData,
        { withCredentials: true }
      );

      console.log(response.data);
      toast.success("Company created successfully!");

      setName("");
      setDescription("");
      setWebsite("");
      setLocation("");

      setTimeout(() => {
        navigate("/recruiter/dashboard");
      }, 1200);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create company");
    }
  }

  return (
    <section className="create-company-page">
      <div className="create-company-card">
        <h2>Add Your Company</h2>
        <p className="company-subtext">
          Create your company profile before posting jobs on QuickHire.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form className="company-form" onSubmit={handleCreateCompany}>
          <div className="input-group">
            <label>Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write about your company"
            />
          </div>

          <div className="input-group">
            <label>Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter company website"
            />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter company location"
            />
          </div>

          <button type="submit" className="create-company-btn">
            Create Company
          </button>
        </form>
      </div>
    </section>
  );
}