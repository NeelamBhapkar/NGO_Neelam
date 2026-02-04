import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChartLine, FaAward } from "react-icons/fa";

const NgoDashboard = () => {
  const navigate = useNavigate();

  // --- 1. States ---
  const [userDetail, setUserDetail] = useState({});
  const [reqCount, setCounts] = useState({ active: 0, pending: 0 });
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);

  const BASE_URL = "http://localhost:8083/api/ngo";

  // --- 2. Load User Session ---
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUserDetail(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Session parse error", e);
    }
  }, []);

  // --- 3. Fetch Dashboard Data ---
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // We fetch all data in parallel for speed
        const [activeRes, pendingRes, beneRes, donationsRes] = await Promise.all([
          fetch(`${BASE_URL}/getActive`).catch(() => ({ ok: false })),
          fetch(`${BASE_URL}/getPending`).catch(() => ({ ok: false })),
          fetch(`${BASE_URL}/countBeneficiaries`).catch(() => ({ ok: false })),
          fetch(`${BASE_URL}/recent-donations`).catch(() => ({ ok: false }))
        ]);

        // Process Active Count
        if (activeRes.ok) {
          const data = await activeRes.json();
          setCounts(prev => ({ ...prev, active: data }));
        }

        // Process Pending Count
        if (pendingRes.ok) {
          const data = await pendingRes.json();
          setCounts(prev => ({ ...prev, pending: data }));
        }

        // Process Beneficiary Count
        if (beneRes.ok) {
          const data = await beneRes.json();
          setBeneficiaryCount(data);
        }

        // Process Recent Donations List
        if (donationsRes.ok) {
          const data = await donationsRes.json();
          // Ensure data is an array before setting it
          setRecentDonations(Array.isArray(data) ? data : []);
        }

      } catch (err) {
        console.error("Critical Dashboard Fetch Error:", err);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: "#f6faf8", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0 text-dark">NGO Dashboard</h1>
          <p className="text-muted small mb-0">
            Welcome back, <span className="fw-bold text-primary">{userDetail?.username || "Admin"}</span>
          </p>
        </div>
        <button className="btn btn-outline-danger shadow-sm px-4" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 position-relative overflow-hidden">
            <p className="text-muted small mb-1 fw-semibold">Active Requests</p>
            <h2 className="fw-bold mb-2">{reqCount.active}</h2>
            <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={() => navigate("/view-requests")}>
              Manage
            </button>
            <FaAward className="position-absolute" style={{ top: '10px', right: '10px', opacity: 0.1, fontSize: '40px', color: '#0d6efd' }} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 position-relative overflow-hidden">
            <p className="text-muted small mb-1 fw-semibold">Pending Requests</p>
            <h2 className="fw-bold mb-2">{reqCount.pending}</h2>
            <button className="btn btn-warning btn-sm text-white rounded-pill px-3" onClick={() => navigate("/view-requests")}>
              Review
            </button>
            <FaChartLine className="position-absolute" style={{ top: '10px', right: '10px', opacity: 0.1, fontSize: '40px', color: '#ffc107' }} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 position-relative overflow-hidden">
            <p className="text-muted small mb-1 fw-semibold">Total Beneficiaries</p>
            <h2 className="fw-bold mb-2">{beneficiaryCount}</h2>
            <div className="mt-4" style={{ height: '31px' }}></div> {/* Spacer to match button height */}
            <FaUsers className="position-absolute" style={{ top: '10px', right: '10px', opacity: 0.1, fontSize: '40px', color: '#198754' }} />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* IMPACT METRICS */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <h5 className="fw-bold mb-4">Impact Metrics</h5>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Rations Provided</span>
              <span className="fw-bold">5,678</span>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom">
              <span className="text-muted">Medical Aid</span>
              <span className="fw-bold">145</span>
            </div>
            <div className="d-flex justify-content-between py-2">
              <span className="text-muted">Education Support</span>
              <span className="fw-bold">89</span>
            </div>
          </div>
        </div>

        {/* RECENT DONATIONS */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
            <h5 className="fw-bold mb-4">Recent Completed Donations</h5>
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {recentDonations.length > 0 ? (
                recentDonations.map((item) => (
                  <div key={item.requestId} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div>
                      <p className="fw-bold mb-0">Request ID: #{item.requestId}</p>
                      <p className="text-muted small mb-0">{item.description || "Donation successfully fulfilled"}</p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold mb-0 text-success">{formatCurrency(item.amountNeeded)}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {item.requestDate ? new Date(item.requestDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted mb-0">No completed donations found in database.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NgoDashboard;