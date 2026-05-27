import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();

  // --- State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. PREVENT ACCESS IF ALREADY LOGGED IN
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      // Redirect to dashboard immediately if session exists
      const navOptions = { replace: true };
      switch (user.role) {
        case "Admin": navigate("/admin-dashboard", navOptions); break;
        case "NGO": navigate("/ngo-dashboard", navOptions); break;
        case "Donor": navigate("/donor-dashboard", navOptions); break;
        case "Beneficiary": navigate("/beneficiary-dashboard", navOptions); break;
        default: navigate("/", navOptions);
      }
    }
  }, [navigate]);

  // 2. Load "Remember Me" email (Email can stay in LocalStorage for convenience)
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5096/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Displays "Account Under Verification" error here
        throw new Error(data.message || "Login failed");
      }

      // Handle "Remember Me" (Email only)
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // 3. SAVE TO SESSION STORAGE (Secure, cleared on tab close)
      sessionStorage.setItem("token", data.token); 
      sessionStorage.setItem("user", JSON.stringify(data));

      // 4. REDIRECT WITH REPLACE (Prevents Back Button)
      const navOptions = { replace: true };
      
      switch (data.role) {
        case "Admin": navigate("/admin-dashboard", navOptions); break;
        case "NGO": navigate("/ngo-dashboard", navOptions); break;
        case "Donor": navigate("/donor-dashboard", navOptions); break;
        case "Beneficiary": navigate("/beneficiary-dashboard", navOptions); break;
        default: navigate("/", navOptions);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 bg-white" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="row g-0 h-100">
        
        {/* LEFT PANEL */}
        <div 
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 position-relative"
          style={{
            height: '100%',
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.9), rgba(6, 95, 70, 0.9)), url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ maxWidth: "450px" }}>
            <h1 className="display-4 fw-bold mb-3">Welcome Back</h1>
            <h2 className="h3 fw-light mb-4">to NGO-Connect</h2>
            <p className="lead mb-5 opacity-75">Continue your journey of making a positive impact in communities worldwide.</p>
            <div className="d-flex flex-column gap-3">
              {["Track your donations", "Support multiple campaigns", "See your impact in real-time"].map((text, index) => (
                <div key={index} className="d-flex align-items-center fs-6">
                  <span className="bg-white bg-opacity-25 rounded-circle p-1 me-3 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                     <FaCheck size={12} />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div 
          className="col-md-6 col-12 d-flex align-items-center justify-content-center position-relative"
          style={{ height: '100%', overflowY: 'auto' }}
        >
          <Link to="/" className="btn btn-link text-decoration-none position-absolute top-0 start-0 m-3 fw-bold d-flex align-items-center gap-2" style={{ color: '#10b981', zIndex: 10 }}>
            <FaArrowLeft /> Back to Home
          </Link>

          <div className="w-100 px-4 px-md-5 py-5" style={{ maxWidth: "500px" }}>
            <div className="mb-4 text-center text-md-start pt-5 pt-md-0">
              <h2 className="fw-bold text-dark mb-2">Sign In</h2>
              <p className="text-muted small">Enter your credentials to access your account</p>
            </div>

            {error && <div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-secondary">Email Address</label>
                <input type="email" className="form-control bg-light border-0 py-2" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-secondary">Password</label>
                <input type="password" className="form-control bg-light border-0 py-2" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input shadow-none" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ cursor: 'pointer', borderColor: '#10b981' }} />
                  <label className="form-check-label small text-muted" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>Remember me</label>
                </div>
                <Link to="/forgot-password" className="small text-decoration-none fw-bold" style={{ color: '#10b981' }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn w-100 text-white fw-bold shadow-sm py-2 rounded-pill" disabled={isLoading} style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4 text-muted small">
              Don't have an account? <Link to="/register" className="ms-1 text-decoration-none fw-bold" style={{ color: '#10b981' }}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;