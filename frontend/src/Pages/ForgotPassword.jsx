import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../style/LoginPage.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/forgot-password`,
        { email }
      );

      toast.success("Password reset link sent. Check your email.");
      setEmail("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="login-page">
      <div className="login-right">
        <div className="login-form-card">
          <h2>Forgot Password</h2>
          <p className="form-subtext">Enter your email to receive reset instructions.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
