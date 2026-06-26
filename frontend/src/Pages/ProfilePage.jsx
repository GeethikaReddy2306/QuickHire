import "../style/ProfilePage.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
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

function photoSrc(url, cacheBust) {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cb=${cacheBust || Date.now()}`;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setPhoneNumber(String(user.phoneNumber || ""));
    setBio(user.profile?.bio || "");
    setSkills(user.profile?.skills?.join(", ") || "");
  }, [user]);

  useEffect(() => {
    if (!user || photoFile) return;

    setPhotoPreview(
      photoSrc(user.profile?.photo || "", user._photoCacheBust)
    );
  }, [user?.profile?.photo, user?._photoCacheBust, photoFile]);

  useEffect(() => {
    console.log("[ProfilePage] user.profile.photo:", user?.profile?.photo);
    console.log("[ProfilePage] photoPreview:", photoPreview);
    console.log(
      "[ProfilePage] localStorage photo:",
      JSON.parse(localStorage.getItem("quickhireUser") || "null")?.profile?.photo
    );
  }, [user, photoPreview]);

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
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !String(phoneNumber).trim()
    ) {
      setError("Name, Email and Phone Number are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phoneNumber", String(phoneNumber));
      formData.append("bio", bio);
      formData.append("skills", skills);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      console.log("[ProfilePage] request body fields:", {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: String(phoneNumber),
        bio,
        skills,
        hasResume: !!resumeFile,
        hasPhoto: !!photoFile,
        photoFileName: photoFile?.name,
      });

      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/user/profile/update`,
        formData,
        { withCredentials: true }
      );

      console.log("[ProfilePage] API response:", data);
      console.log("[ProfilePage] response.data.user:", data.user);
      console.log(
        "[ProfilePage] response photo URL:",
        data.user?.profile?.photo
      );

      const updatedUser = data.user || data.data?.user;

      if (!updatedUser) {
        throw new Error("Unexpected response shape — no user found");
      }

      const savedUser = updateUser(updatedUser);

      console.log(
        "[ProfilePage] AuthContext user after updateUser:",
        savedUser?.profile?.photo
      );

      setPhotoPreview(
        photoSrc(savedUser.profile?.photo || "", savedUser._photoCacheBust)
      );

      setResumeFile(null);
      setPhotoFile(null);
      setError("");
      setIsEditing(false);

      toast.success(data.message);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message || "Profile update failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setIsEditing(false);

    setName(user.name || "");
    setEmail(user.email || "");
    setPhoneNumber(String(user.phoneNumber || ""));
    setBio(user.profile?.bio || "");
    setSkills(user.profile?.skills?.join(", ") || "");

    setResumeFile(null);
    setPhotoFile(null);

    setPhotoPreview(
      photoSrc(user.profile?.photo || "", user._photoCacheBust)
    );

    setError("");
  }

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <aside className="profile-identity-card">
          <div className="profile-photo-xl">
            {photoPreview ? (
              <img
                key={photoPreview}
                src={photoPreview}
                alt={name}
              />
            ) : (
              <span>{initials(name)}</span>
            )}
          </div>

          <h1>{name}</h1>
          <p>{email}</p>

          <span className="role-badge">{user.role}</span>

          {!isEditing && (
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </aside>

        <main className="profile-content-card">
          {!isEditing ? (
            <>
              <div className="profile-section-title">
                <h2>Profile Overview</h2>
                <p>
                  Your public hiring profile and application documents.
                </p>
              </div>

              <div className="profile-details-grid">
                <div className="detail-box">
                  <span>Phone</span>
                  <strong>{user.phoneNumber || "Not added yet"}</strong>
                </div>

                <div className="detail-box wide-box">
                  <span>Bio</span>
                  <p>{user.profile?.bio || "No bio added yet"}</p>
                </div>

                <div className="detail-box wide-box">
                  <span>Skills</span>

                  {user.profile?.skills?.length ? (
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

                <div className="detail-box wide-box">
                  <span>Resume</span>

                  {user.profile?.resume ? (
                    <button
                      className="resume-link"
                      onClick={async () => {
                        try {
                          const res = await axios.get(
                            `${import.meta.env.VITE_SERVER_URL}/api/user/resume/${user._id}`,
                            {
                              withCredentials: true,
                            }
                          );

                          window.open(res.data.url, "_blank");
                        } catch {
                          toast.error("Unable to open resume");
                        }
                      }}
                    >
                      {user.profile.resumeOriginalName || "View Resume"}
                    </button>
                  ) : (
                    <p>No resume uploaded yet</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <form
              className="profile-edit-form"
              onSubmit={handleProfileUpdate}
            >
              <div className="profile-section-title">
                <h2>Edit Profile</h2>
                <p>Keep your profile updated for recruiters.</p>
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="photo-upload-row">
                <div className="profile-photo-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" />
                  ) : (
                    <span>{initials(name)}</span>
                  )}
                </div>

                <label className="file-pill">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      handlePhotoChange(e.target.files?.[0])
                    }
                  />
                </label>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
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
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label>Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Skills</label>
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div className="input-group full-width">
                  <label>Resume (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setResumeFile(e.target.files?.[0])
                    }
                  />
                  <p className="file-hint">
                    {resumeFile?.name ||
                      user.profile?.resumeOriginalName ||
                      "No Resume Selected"}
                  </p>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
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
        </main>
      </div>
    </section>
  );
}
