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
  const [skills, setSkills] = useState(
    user?.profile?.skills?.join(", ") || ""
  );
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>No user data found</h2>
          <p>Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phoneNumber || !bio || !skills) {
      setError("Please fill all fields");
      return;
    }

    try {
      const updatedData = {
        name,
        email,
        phoneNumber,
        bio,
        skills,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/profile/update`,
        updatedData,
        { withCredentials: true }
      );

      toast.success("Profile updated successfully!");

      setUser(response.data.user);
      localStorage.setItem("quickhireUser", JSON.stringify(response.data.user));

      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Profile update failed");
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
                <p>
                  {user.profile?.skills?.length > 0
                    ? user.profile.skills.join(", ")
                    : "No skills added yet"}
                </p>
              </div>

              <div className="detail-box">
                <h3>Resume</h3>
                <p>
                  {user.profile?.resumeOriginalName || "No resume uploaded yet"}
                </p>
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
                />
              </div>

              <div className="input-group full-width">
                <label>Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Example: React, Node.js, MongoDB"
                />
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

              <button type="submit" className="edit-profile-btn">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}