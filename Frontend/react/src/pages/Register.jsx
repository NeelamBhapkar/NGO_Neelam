import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import videoBg from "../assets/register_background.mp4";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Donor");
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  
  const [formData, setFormData] = useState({
    username: "", email: "", phoneNo: "", panNo: "", password: "", address: "", state: "", city: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5096/api/Auth/states")
      .then((res) => res.json()).then((data) => setStatesList(data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetch(`http://localhost:5096/api/Auth/cities/${formData.state}`)
        .then((res) => res.json()).then((data) => setCitiesList(data))
        .catch((err) => console.error("Error fetching cities:", err));
    } else { setCitiesList([]); }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = name === "panNo" ? value.toUpperCase() : value;
    setFormData({ ...formData, [name]: finalValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) { newErrors.email = "Invalid email."; isValid = false; }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNo)) { newErrors.phoneNo = "Phone must be 10 digits."; isValid = false; }
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNo)) { newErrors.panNo = "Invalid PAN."; isValid = false; }
    if (!formData.username.trim()) { newErrors.username = "Required"; isValid = false; }
    if (!formData.password) { newErrors.password = "Required"; isValid = false; }
    if (!formData.address.trim()) { newErrors.address = "Required"; isValid = false; }
    if (!formData.state) { newErrors.state = "Required"; isValid = false; }
    if (!formData.city) { newErrors.city = "Required"; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      username: formData.username,
      email: formData.email,
      phoneNo: formData.phoneNo,
      panNo: formData.panNo,
      password: formData.password,
      address: formData.address,
      stateId: parseInt(formData.state),
      cityId: parseInt(formData.city),
      roleName: role,
    };

    try {
      const response = await fetch("http://localhost:5096/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (role === "NGO") {
            alert("Registration Successful! Your NGO account is 'Under Verification'. You can login once an Admin approves your request.");
            navigate("/login");
        } else {
            navigate("/register-success", { state: { role: role } });
        }
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '100vh' }}>
      <video autoPlay loop muted className="position-absolute w-100 h-100" style={{ objectFit: "cover", zIndex: -2 }}>
        <source src={videoBg} type="video/mp4" />
      </video>
      <div className="position-absolute w-100 h-100" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,0,0.6))", zIndex: -1 }}></div>
      <div className="container">
        <div className="card border-0 mx-auto shadow-lg" style={styles.glassCard}>
          <div className="card-body p-4">
            <div className="text-center mb-3">
              <h3 className="fw-bold m-0 text-white">Create Account</h3>
              <p className="text-white-50 small mb-0">Join NGO-Connect and make an impact 🌱</p>
            </div>
            <div className="d-flex justify-content-center gap-2 mb-3 p-1 rounded-3 bg-black bg-opacity-25 mx-auto" style={{ maxWidth: "500px" }}>
              {["NGO", "Donor", "Beneficiary"].map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)} className={`btn btn-sm flex-fill fw-bold transition-all ${role === r ? 'text-white shadow-sm' : 'text-white-50'}`} style={{ background: role === r ? "linear-gradient(135deg, #10b981, #059669)" : "transparent", border: "none", borderRadius: "8px", padding: "6px", fontSize: "0.9rem" }}>{r}</button>
              ))}
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-2"> 
                <div className="col-md-6"><input type="text" name="username" value={formData.username} onChange={handleChange} className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.username ? 'is-invalid' : ''}`} placeholder="Username" /></div>
                <div className="col-md-6"><input type="email" name="email" value={formData.email} onChange={handleChange} className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" /></div>
                <div className="col-md-6"><input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} maxLength="10" className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.phoneNo ? 'is-invalid' : ''}`} placeholder="Phone" /></div>
                <div className="col-md-6"><input type="text" name="panNo" value={formData.panNo} onChange={handleChange} maxLength="10" className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.panNo ? 'is-invalid' : ''}`} placeholder="PAN" /></div>
                <div className="col-12"><input type="password" name="password" value={formData.password} onChange={handleChange} className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" /></div>
                <div className="col-12"><textarea name="address" value={formData.address} onChange={handleChange} className={`form-control form-control-sm bg-light bg-opacity-50 text-dark border-0 ${errors.address ? 'is-invalid' : ''}`} rows="2" placeholder="Address"></textarea></div>
                <div className="col-md-6">
                  <select name="state" className={`form-select form-select-sm bg-light bg-opacity-50 text-dark border-0 ${errors.state ? 'is-invalid' : ''}`} value={formData.state} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, city: "", state: e.target.value })); }}>
                    <option value="">State</option>
                    {statesList.map((st) => <option key={st.stateId} value={st.stateId}>{st.stateName}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <select name="city" className={`form-select form-select-sm bg-light bg-opacity-50 text-dark border-0 ${errors.city ? 'is-invalid' : ''}`} value={formData.city} onChange={handleChange} disabled={!formData.state}>
                    <option value="">City</option>
                    {citiesList.map((ct) => <option key={ct.cityId} value={ct.cityId}>{ct.cityName}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-white border-opacity-25">
                <div className="small text-white-50"><span>Have an account? </span><Link to="/login" className="text-decoration-none fw-bold text-white">Login</Link></div>
                <button type="submit" className="btn btn-sm text-white fw-bold px-4 rounded-pill shadow-sm" style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}>Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  glassCard: { maxWidth: "850px", background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "20px" }
};

export default Register;