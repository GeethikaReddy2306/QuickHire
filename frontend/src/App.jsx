import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import JobsPage from "./Pages/JobsPage";
import BrowsePage from "./Pages/BrowsePage";
import Signup from "./Pages/Signup";
import LoginPage from "./Pages/LoginPage";
import Footer from "./components/Footer";
import ProfilePage from "./Pages/ProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
import CreateCompanyPage from "./Pages/CreateCompanyPage";
import CreateJobPage from "./Pages/CreateJobPage";
export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard/>}/>
        <Route path="/recruiter/company/create" element={<CreateCompanyPage />} />
        <Route path="/recruiter/job/create" element={<CreateJobPage />} />
      </Routes>

      <ToastContainer />
      <Footer />
    </div>
  );
}