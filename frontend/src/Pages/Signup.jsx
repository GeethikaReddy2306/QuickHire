import { Link ,useNavigate} from "react-router-dom";
import "../style/Signup.css";
import { useState } from "react";
import { toast } from "react-toastify";


import axios from "axios";
export default function Signup() {
  const[fullName,setFullName]=useState('');
   const[email,setEmail]=useState('');
   const [number,setNumber]=useState('');
    const[password,setPassword]=useState('');
     const[confirmPassword,setConfirmPassword]=useState('');
     const [role, setRole] = useState('');
     const [error, setError] = useState('');
     const navigate = useNavigate();
     async function handleSubmit(e){
       e.preventDefault();
       setError('');
       if(!fullName||!email||!confirmPassword||!number||!password||!role){
        setError("please fill all fields");
        return;
       }
       if(password!==confirmPassword){
        setError("Password and Confirm Password do not match");
        return;
       }
        try{
         const postData={
          name:fullName
          ,email:email,
           phoneNumber:number,
             password:password,
               role:role
         }
      const response=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/register`, postData);
      console.log(response.data);
     
      
      setFullName('');
setEmail('');
setNumber('');
setPassword('');
setConfirmPassword('');
setRole('');
toast.success("Signup successful!");

setTimeout(() => {
  navigate("/login");
}, 1200);
        }catch(err){
          console.log(err);
         
          setError(err.response?.data?.message || "Signup failed. Please try again."
    );

        
       }
     }
  return (
    <section id="signup-page">
     
        {/* Right Form Panel */}
        <div className="signup-right">
          <div className="signup-form-card">
            <h2>Create Your Account</h2>
            <p className="form-subtext">
              Join QuickHire and start applying to jobs faster.
            </p>
            {error && <p className="error-message">{error}</p>}

            <form  onSubmit={handleSubmit} className="signup-form">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter your full name" />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input type="email"value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel"value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="Phone Number" />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input type="password"value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password"value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm your password" />
              </div>

              <div className="input-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="recruiter">Recruiter</option>
                  </select>
                  </div>

              <button type="submit" className="signup-btn">
                Create Account
              </button>
            </form>

            <p className="login-redirect">
              Already have an account? <Link to="/login">Login</Link>
            </p>
            
          </div>
        </div>
    
    </section>
  );
}