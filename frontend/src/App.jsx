import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./Pages/HomePage";
import JobsPage from "./Pages/JobsPage";
import BrowsePage from "./Pages/BrowsePage";
import Signup from "./Pages/Signup";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import JobDetailsPage from "./Pages/JobDetailsPage";
import AppliedJobsPage from "./Pages/AppliedJobsPage";

import RecruiterDashboard from "./Pages/RecruiterDashboard";
import CreateJobPage from "./Pages/CreateJobPage";
import RecruiterJobsPage from "./Pages/RecruiterJobsPage";
import RecruiterApplicantsPage from "./Pages/RecruiterApplicantsPage";
import RecruiterCompaniesPage from "./Pages/RecruiterCompaniesPage";
import RecruiterCreateCompanyPage from "./Pages/RecruiterCreateCompanyPage";
import RecruiterEditCompanyPage from "./Pages/RecruiterEditCompanyPage";

import AccessDeniedPage from "./Pages/AccessDeniedPage";

import RecruiterProtectedRoute from "./components/RecruiterProtectedRoute";
import StudentProtectedRoute from "./components/StudentProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <StudentProtectedRoute>
              <ProfilePage />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/applied-jobs"
          element={
            <StudentProtectedRoute>
              <AppliedJobsPage />
            </StudentProtectedRoute>
          }
        />

        {/* Recruiter Routes */}

        <Route
          path="/recruiter/dashboard"
          element={
            <RecruiterProtectedRoute>
              <RecruiterDashboard />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/job/create"
          element={
            <RecruiterProtectedRoute>
              <CreateJobPage />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <RecruiterProtectedRoute>
              <RecruiterJobsPage />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <RecruiterProtectedRoute>
              <RecruiterApplicantsPage />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/companies"
          element={
            <RecruiterProtectedRoute>
              <RecruiterCompaniesPage />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/company/create"
          element={
            <RecruiterProtectedRoute>
              <RecruiterCreateCompanyPage />
            </RecruiterProtectedRoute>
          }
        />

        <Route
          path="/recruiter/company/edit/:id"
          element={
            <RecruiterProtectedRoute>
              <RecruiterEditCompanyPage />
            </RecruiterProtectedRoute>
          }
        />

      </Routes>

      <ToastContainer />
      <Footer />
    </div>
  );
}