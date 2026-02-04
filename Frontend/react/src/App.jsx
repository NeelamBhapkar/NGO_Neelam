import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";

// --- IMPORT DASHBOARDS ---
import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard";
import RegisterSuccessfully from "./pages/RegisterSuccessfully";
import Campaigns from "./pages/Campaign";
import ForgotPassword from "./pages/ForgotPassword";
import UserManagement from "./pages/UserManagement";

// --- SECURITY IMPORTS ---
import ProtectedRoute from "./components/ProtectedRoute";
import FetchRequest from "./pages/ViewRequests"; // Ensure this filename matches your file system (ViewRequests.jsx vs viewrequest.jsx)
import PendingApprovals from "./pages/PendingApprovals";
import CategoryManagement from "./pages/CategoryManagement";

// --- PUBLIC PAGES ---
import FAQs from "./pages/FAQs";
import OurMission from "./pages/OurMission";

// --- TITLE UPDATER COMPONENT ---
const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    // Map your paths to specific titles
    const routeTitles = {
      "/": "Home",
      "/login": "Login",
      "/register": "Join Us",
      "/contact": "Contact Us",
      "/campaigns": "Active Campaigns",
      "/faqs": "Frequently Asked Questions",
      "/our-mission": "Our Mission",
      "/register-success": "Welcome!",
      "/forgot-password": "Reset Password",
      "/admin-dashboard": "Admin Panel",
      "/ngo-dashboard": "NGO Dashboard",
      "/donor-dashboard": "Donor Portal",
      "/beneficiary-dashboard": "Impact Portal",
      "/view-requests": "View active requests",
      "/admin/pending-approvals": "Verify NGOs",
      "/admin/categories": "Category Management"
    };

    const currentTitle = routeTitles[location.pathname] || "Connect";
    document.title = `NGO-Connect | ${currentTitle}`;
  }, [location]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Syncs the <title> tag with the current route */}
        <PageTitleUpdater />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Navbar />

          <div
            style={{
              flex: 1,
              position: "relative",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/our-mission" element={<OurMission />} />
              
              <Route
                path="/register-success"
                element={<RegisterSuccessfully />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/pending-approvals"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <PendingApprovals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <CategoryManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ngo-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["NGO"]}>
                    <NgoDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Donor"]}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-requests"
                element={
                  <ProtectedRoute allowedRoles={["NGO", "Donor"]}>
                    <FetchRequest />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/beneficiary-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["Beneficiary"]}>
                    <BeneficiaryDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;