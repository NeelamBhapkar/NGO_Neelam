import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaChartLine, FaDollarSign, FaFileInvoice, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const DonorDashboard = () => {
  const navigate = useNavigate();
  // Ensure we safely parse the user object
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId = user.userId; // Assuming your login response saves 'userId'

  // --- State Management ---
  const [ngoList, setNgoList] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Form States
  const [selectedNgoId, setSelectedNgoId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Stats State (Calculated dynamically)
  const [stats, setStats] = useState({
    totalDonated: 0,
    count: 0,
    impact: 0
  });

  // --- 1. Fetch Data on Load ---
  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect if not logged in
      return;
    }

    // A. Fetch List of Approved NGOs for Dropdown
    fetch("http://localhost:8080/donor/ngos")
      .then(res => res.json())
      .then(data => setNgoList(data))
      .catch(err => console.error("Error loading NGOs:", err));

    // B. Fetch Donation History & Calculate Stats
    fetchHistory();
  }, [userId, navigate]);

const fetchHistory = () => {
    fetch(`http://localhost:8080/donor/history/${userId}`)
      .then(res => res.ok ? res.json() : []) // If error, return empty array
      .then(data => {
        if (Array.isArray(data)) { // Check if it's actually an array
            setHistory(data);
            calculateStats(data);
        }
      })
      .catch(err => console.error("Error loading history:", err));
};

  const calculateStats = (data) => {
    const total = data.reduce((sum, item) => sum + (item.amount_donated || item.amount || 0), 0);
    setStats({
      totalDonated: total,
      count: data.length,
      impact: Math.floor(total / 1000) // Mock logic: 1 life impacted per ₹1000 donated
    });
  };

  // --- 2. Handle Donation Submit ---
  const handleDonate = () => {
    if (!selectedNgoId || !amount) {
      alert("Please select an NGO and enter an amount.");
      return;
    }
    if (parseFloat(amount) <= 0) {
      alert("Donation amount must be greater than ₹0.");
      return;
    }

    const donationPayload = {
      user_id: userId,
      amount: parseFloat(amount),
      description: description,
      // We send the goal amount as the donation amount for direct fund transfers
      amount_donated: parseFloat(amount) 
    };

    fetch(`http://localhost:8080/donor/donate/${selectedNgoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationPayload)
    })
    .then(res => {
      if (res.ok) {
        alert("Donation Successful! Thank you for your support.");
        // Reset Form
        setAmount("");
        setDescription("");
        setSelectedNgoId("");
        // Refresh History & Stats
        fetchHistory();
      } else {
        alert("Donation failed. Please try again.");
      }
    })
    .catch(err => console.error("Donation error:", err));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  // --- Formatter for Currency ---
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // --- UI Configuration (Stats Cards) ---
  const statCards = [
    { title: "Total Donated", value: formatCurrency(stats.totalDonated), icon: <FaHeart />, iconColor: "text-danger", bg: "bg-danger bg-opacity-10" },
    { title: "Donations Made", value: stats.count, icon: <FaChartLine />, iconColor: "text-primary", bg: "bg-primary bg-opacity-10" },
    { title: "Lives Impacted", value: stats.impact, icon: <FaDollarSign />, iconColor: "text-success", bg: "bg-success bg-opacity-10" },
    { title: "Receipts Generated", value: stats.count, icon: <FaFileInvoice />, iconColor: "text-primary", bg: "bg-info bg-opacity-10" },
  ];

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      <div className="container">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5 bg-white p-4 rounded shadow-sm">
          <div>
            <h1 className="h3 mb-1 fw-bold text-dark">Donor Dashboard</h1>
            <p className="text-muted mb-0">
              Welcome back, <strong className="text-primary">{user.username || "Donor"}</strong>
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger d-flex align-items-center gap-2 fw-semibold"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="row g-4 mb-5">
          {statCards.map((stat, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex justify-content-between align-items-center p-4">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase">{stat.title}</span>
                    <h2 className="mb-0 fw-bold text-dark mt-1">{stat.value}</h2>
                  </div>
                  <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${stat.bg} ${stat.iconColor}`} style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT (Form & Impact) */}
        <div className="row g-4 mb-5">
          
          {/* Donation Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h4 className="card-title fw-bold mb-1">Make a Donation</h4>
                <p className="text-muted small">Support approved NGOs directly</p>
              </div>
              <div className="card-body p-4">
                <form>
                  {/* DROPDOWN FOR NGO SELECTION */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Select NGO</label>
                    <select 
                      className="form-control form-select" 
                      value={selectedNgoId}
                      onChange={(e) => setSelectedNgoId(e.target.value)}
                    >
                      <option value="">-- Choose an NGO to support --</option>
                      {/* Safe check to prevent .map() on non-arrays */}
                      {Array.isArray(ngoList) && ngoList.map((ngo) => (
                        <option key={ngo.userId} value={ngo.userId}>
                          {ngo.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Amount (₹)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)
                        
                      } 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Description (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Purpose of donation"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)} 
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleDonate}
                    className="btn btn-secondary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 mt-2"
                  >
                    <FaHeart /> Donate Now
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Impact Summary (Static Visualization for now, updated dynamic values) */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h4 className="card-title fw-bold mb-1">Your Impact</h4>
                <p className="text-muted small">See how your donations make a difference</p>
              </div>
              <div className="card-body p-4">
                <div className="bg-danger bg-opacity-10 p-4 rounded mb-4 text-center">
                  <h2 className="text-danger fw-bold mb-0">{formatCurrency(stats.totalDonated)}</h2>
                  <p className="text-danger small mb-0 fw-semibold">Total contribution to date</p>
                </div>
                
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                    <span className="text-muted small">Education Support</span>
                    <strong className="text-dark small">45%</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                    <span className="text-muted small">Healthcare</span>
                    <strong className="text-dark small">30%</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Food & Nutrition</span>
                    <strong className="text-dark small">25%</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="d-block small fw-bold text-secondary mb-2">Recognition Badge</span>
                  <span className="badge bg-warning text-dark border border-warning px-3 py-2 rounded-pill">
                    ⭐ Gold Contributor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DONATION HISTORY TABLE */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <h4 className="card-title fw-bold mb-1">Donation History</h4>
            <p className="text-muted small">Your past donations and receipts</p>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4 text-secondary small text-uppercase">Date</th>
                    <th className="py-3 px-4 text-secondary small text-uppercase">Type</th>
                    <th className="py-3 px-4 text-secondary small text-uppercase">Description</th>
                    <th className="py-3 px-4 text-secondary small text-uppercase">Amount</th>
                    <th className="py-3 px-4 text-secondary small text-uppercase">Status</th>
                    <th className="py-3 px-4 text-secondary small text-uppercase text-end">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? history.map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 fw-semibold text-dark">
                        {new Date(row.donation_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">Direct Fund</td>
                      <td className="px-4 py-3 text-muted small">{row.description || "General Support"}</td>
                      <td className="px-4 py-3 fw-bold">{formatCurrency(row.amount_donated || row.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="badge rounded-pill fw-semibold px-3 py-2 bg-success bg-opacity-10 text-success">
                          Completed
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2">
                          <FaFileInvoice /> View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No donations made yet. Start your journey today!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;