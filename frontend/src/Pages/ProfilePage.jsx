import "../style/ProfilePage.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function initials(name = "U") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.skills?.join(", ") || "");
  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile?.photo || "");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <section className="profile-page">
        <div className="profile-card empty-profile">
          <h2>No user data found</h2>
          <p>Please login to view your profile.</p>
        </div>
      </section>
    );
  }

  function handlePhotoChange(file) {
    setPhotoFile(file || null);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
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

      if (resumeFile) formData.append("resume", resumeFile);
      if (photoFile) formData.append("photo", photoFile);

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      toast.success(response.data.message || "Profile updated successfully");
      setUser(response.data.user);
      localStorage.setItem("quickhireUser", JSON.stringify(response.data.user));
      setIsEditing(false);
      setResumeFile(null);
      setPhotoFile(null);
      setPhotoPreview(response.data.user?.profile?.photo || "");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Profile update failed");
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setError("");
    setResumeFile(null);
    setPhotoFile(null);
    setPhotoPreview(user?.profile?.photo || "");
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhoneNumber(user?.phoneNumber || "");
    setBio(user?.profile?.bio || "");
    setSkills(user?.profile?.skills?.join(", ") || "");
  }

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <aside className="profile-identity-card">
          <div className="profile-photo-xl">
            {user?.profile?.photo ? (
              <img src={user.profile.photo} alt={`${user.name} profile`} />
            ) : (
              <span>{initials(user?.name)}</span>
            )}
          </div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="role-badge">{user?.role}</span>
          <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </aside>

        <main className="profile-content-card">
          {!isEditing ? (
            <>
              <div className="profile-section-title">
                <h2>Profile Overview</h2>
                <p>Your public hiring profile and application documents.</p>
              </div>

              <div className="profile-details-grid">
                <div className="detail-box">
                  <span>Phone</span>
                  <strong>{user?.phoneNumber || "Not added yet"}</strong>
                </div>
                <div className="detail-box wide-box">
                  <span>Bio</span>
                  <p>{user?.profile?.bio || "No bio added yet"}</p>
                </div>
                <div className="detail-box wide-box">
                  <span>Skills</span>
                  {user?.profile?.skills?.length > 0 ? (
                    <div className="skills-wrap">
                      {user.profile.skills.map((skill, index) => (
                        <span key={index} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p>No skills added yet</p>
                  )}
                </div>
                <div className="detail-box wide-box">
                  <span>Resume</span>
                  {user?.profile?.resume ? (
                    <a href={user.profile.resume} target="_blank" rel="noreferrer" className="resume-link">
                      {user.profile.resumeOriginalName || "View Resume"}
                    </a>
                  ) : (
                    <p>No resume uploaded yet</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <form className="profile-edit-form" onSubmit={handleProfileUpdate}>
              <div className="profile-section-title">
                <h2>Edit Profile</h2>
                <p>Keep your profile current for recruiters and applications.</p>
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="photo-upload-row">
                <div className="profile-photo-preview">
                  {photoPreview ? <img src={photoPreview} alt="Profile preview" /> : <span>{initials(name)}</span>}
                </div>
                <label className="file-pill">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                  />
                </label>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Bio</label>
                  <textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="input-group full-width">
                  <label>Skills</label>
                  <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
                <div className="input-group full-width">
                  <label>Resume (PDF / DOC / DOCX)</label>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0])} />
                  <p className="file-hint">
                    {resumeFile?.name || user?.profile?.resumeOriginalName || "No resume selected"}
                  </p>
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                <button type="submit" className="edit-profile-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </section>
  );
}
