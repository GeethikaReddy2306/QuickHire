import "../style/ProfilePage.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.skills?.join(", ") || "");
  const [resumeFile, setResumeFile] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <h2>No user data found</h2>
          <p>Please login to view your profile.</p>
        </div>
      </section>
    );
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phoneNumber) {
      setError("Name, email and phone number are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("bio", bio);
      formData.append("skills", skills);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success(response.data.message || "Profile updated successfully");

      setUser(response.data.user);
      localStorage.setItem("quickhireUser", JSON.stringify(response.data.user));

      setIsEditing(false);
      setResumeFile(null);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-main-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="profile-details">
              <div className="detail-box">
                <h3>Phone Number</h3>
                <p>{user.phoneNumber || "Not added yet"}</p>
              </div>

              <div className="detail-box">
                <h3>Bio</h3>
                <p>{user.profile?.bio || "No bio added yet"}</p>
              </div>

              <div className="detail-box">
                <h3>Skills</h3>
                {user.profile?.skills?.length > 0 ? (
                  <div className="skills-wrap">
                    {user.profile.skills.map((skill, index) => (
                      <span key={index} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No skills added yet</p>
                )}
              </div>

              <div className="detail-box">
                <h3>Resume</h3>
                {user.profile?.resume ? (
                  <a
                    href={user.profile.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="resume-link"
                  >
                    {user.profile.resumeOriginalName || "View Resume"}
                  </a>
                ) : (
                  <p>No resume uploaded yet</p>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={handleProfileUpdate}>
            {error && <p className="error-message">{error}</p>}

            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Bio</label>
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short intro about yourself"
                />
              </div>

              <div className="input-group full-width">
                <label>Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Example: React, Node.js, MongoDB, Java"
                />
              </div>

              <div className="input-group full-width">
                <label>Upload Resume (PDF / DOC / DOCX)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                {user?.profile?.resumeOriginalName && !resumeFile && (
                  <p style={{ marginTop: "8px", fontSize: "14px" }}>
                    Current Resume: {user.profile.resumeOriginalName}
                  </p>
                )}
                {resumeFile && (
                  <p style={{ marginTop: "8px", fontSize: "14px" }}>
                    Selected File: {resumeFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-profile-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}