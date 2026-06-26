import { Link ,useNavigate} from "react-router-dom";
import "../style/LoginPage.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[role,setRole]=useState('');
  const[error,setError]=useState('');
  const { updateUser } = useAuth();
const navigate = useNavigate();
  async function HandleLogin(e){
    e.preventDefault();
       setError("");
       if(!email||!password||!role){
        setError("please fill all fields");
        return;
       }
       try{
       const data={
        email:email,
        password:password,
        role:role
       }
      const response = await axios.post(
  `${import.meta.env.VITE_SERVER_URL}/api/user/login`,
  data,
  { withCredentials: true }
);
       console.log(response.data);

updateUser(response.data.user);
       setEmail('');
       setPassword('');
       setRole('');
       toast.success("Login successful!");
       setTimeout(() => {
  if (response.data.user.role === "student") {
    navigate("/jobs");
  } else if (response.data.user.role === "recruiter") {
    navigate("/recruiter/dashboard");
  }
}, 1200);
      }catch(err){
        console.log(err);
         
          setError(err.response?.data?.message || "Login failed. Please try again.");
      }
  }
  return (
    <section id="login-page">
      <div className="login-right">
        <div className="login-form-card">
          <h2>Welcome Back</h2>
          <p className="form-subtext">
            Login to continue exploring jobs and opportunities.
          </p>

          <form onSubmit={HandleLogin}  className="login-form" >
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e)=>{ setEmail(e.target.value)}} placeholder="Enter your email" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
<div className="input-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  </select>
                  </div>
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <p className="signup-redirect">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </section>
  );
}