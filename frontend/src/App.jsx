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
import RecruiterDashboard from "./Pages/RecruiterDashboard";import CreateJobPage from "./Pages/CreateJobPage";
import RecruiterJobsPage from "./Pages/RecruiterJobsPage";
import RecruiterApplicantsPage from "./Pages/RecruiterApplicantsPage";
import RecruiterCompaniesPage from "./Pages/RecruiterCompaniesPage";
import RecruiterCreateCompanyPage from "./Pages/RecruiterCreateCompanyPage";
import RecruiterEditCompanyPage from "./Pages/RecruiterEditCompanyPage";
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
        <Route path="/recruiter/job/create" element={<CreateJobPage />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<RecruiterApplicantsPage />}/>
        <Route path="/recruiter/companies" element={<RecruiterCompaniesPage />} />
        <Route path="/recruiter/company/create" element={<RecruiterCreateCompanyPage />} />
        <Route path="/recruiter/company/edit/:id" element={<RecruiterEditCompanyPage />} />
</Routes>

      <ToastContainer />
      <Footer />
    </div>
  );
}