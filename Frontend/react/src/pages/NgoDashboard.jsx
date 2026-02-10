import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaHeart, FaChartLine, FaAward } from "react-icons/fa";

// --- CSS CONSTANT OBJECT ---
const styles = {
  dashboardWrapper: {
    padding: "30px 40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f6faf8",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: { fontSize: "24px", fontWeight: "bold", margin: 0 },
  subtitle: { color: "gray", fontSize: "14px", marginTop: "4px" },
  logoutBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    position: "relative",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  iconBase: {
    position: "absolute",
    top: "16px",
    right: "16px",
    fontSize: "20px",
    padding: "8px",
    borderRadius: "50%",
  },
  middleGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr",
    gap: "24px",
    marginBottom: "30px",
  },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  progressBar: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "8px",
  },
  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f1f1f1",
  },
};

const NgoDashboard = () => {
  const navigate = useNavigate();
  const userData = sessionStorage.getItem("user");
  const userDetail = JSON.parse(userData) || {};

  const [reqCount, setCounts] = useState({ active: 0, pending: 0 });
  const uid = userDetail.userId;

  const [activeReqs, setActive] = useState([]);
  const [impactCount, setImpact] = useState({ impact: 0 });
  const [fundRecd, setFunds] = useState({ currentFund: 0, totalFunds: 0 });

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDesc, setDonationDesc] = useState("");

  const openDonateModal = (req) => {
    setSelectedReq(req);
    setShowDonateModal(true);
  };
 // sending donation detals
const handleDonationSubmit = () => {
    
    const amountToDonate = parseFloat(donationAmount);
    
    const currentCollected = selectedReq?.amount_collected || 0;
    const goal = selectedReq?.amount_needed || 0;
    const remaining = goal - currentCollected;

    if (!amountToDonate || amountToDonate <= 0) {
      alert("Please enter a valid donation amount greater than ₹0.");
      return;
    }

   
    if (amountToDonate > remaining) {
        alert(`Limit exceeded! You can only donate up to ₹${remaining}.`);
        return; 
    }
    
    const donationData = {
        user_id: uid,                                  
        item_id: selectedReq.item_id,
        benef_request_id: selectedReq.request_id,      
        amount: selectedReq.amount_needed,             
        amount_donated: amountToDonate,                
        donation_date: new Date().toISOString().split('T')[0], 
        description: donationDesc
    };

    fetch("http://localhost:8080/ngo/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationData)
    })
    .then(res => {
        if (res.ok) {
            alert("Donation Successful!");

            // UPDATE PROGRESS BAR LOCALLY
            setActive(prevReqs => prevReqs.map(req => 
                req.request_id === selectedReq.request_id 
                ? { ...req, amount_collected: (req.amount_collected || 0) + amountToDonate }
                : req
            ));

            // UPDATE TOTAL FUNDS STAT LOCALLY
            setFunds(prev => ({
                ...prev,
                totalFunds: (prev.totalFunds || 0) + amountToDonate
            }));

            setShowDonateModal(false);
            setDonationAmount(""); 
            setDonationDesc("");
        }
    })
    .catch(err => console.error("Donation failed", err));
};

  useEffect(() => {
    if (!uid) return;
    fetch(`http://localhost:8080/ngo/getUnderTakenReq/${uid}`)
      .then(resp => resp.ok ? resp.json() : [])
      .then(data => setActive(data))
      .catch(err => {
        console.log("No request Undertaken yet!", err);
        setActive([]);
      });
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      fetch(`http://localhost:8080/ngo/getActive/${uid}`).then(res => res.json()),
      fetch("http://localhost:8080/ngo/getPending").then(res => res.json())
    ])
      .then(([activeCount, pendingCount]) => {
        setCounts({ active: activeCount, pending: pendingCount });
      })
      .catch(() => console.log("No requests found"))
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    fetch(`http://localhost:8080/ngo/getimpact/${uid}`)
      .then(res => res.ok ? res.json() : 0)
      .then(count => setImpact({ impact: count }))
      .catch(() => setImpact({ impact: 0 }));
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      fetch(`http://localhost:8080/ngo/getcurrent/${uid}`).then(res => res.json()),
      fetch(`http://localhost:8080/ngo/gettotal/${uid}`).then(res => res.json())
    ])
      .then(([currFunds, totFunds]) => {
        setFunds({ currentFund: currFunds, totalFunds: totFunds });
      })
      .catch(err => console.log("Funds fetch error", err));
  }, [uid]);

  const formatCurrency = (amount) => {
    if (amount == null) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1
    }).format(amount);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>NGO Dashboard</h1>
          <p style={styles.subtitle}>Helping Hands Foundation - Welcome, <strong>{userDetail.username}</strong></p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.subtitle}>Approved Requests</p>
          <h2 style={{ fontSize: "28px", margin: "8px 0" }}>{reqCount.active}</h2>
          <button className="btn btn-primary" onClick={() => navigate("/view-requests", { state: { filter: "APPROVED" } })}>Active Requests</button>
          <FaAward style={{ ...styles.iconBase, color: "#2563eb", background: "#dbeafe" }} />
        </div>
        <div style={styles.statCard}>
          <p style={styles.subtitle}>Pending Requests</p>
          <h2 style={{ fontSize: "28px", margin: "8px 0" }}>{reqCount.pending}</h2>
          <button className="btn btn-warning" onClick={() => navigate("/view-requests", { state: { filter: "PENDING" } })}>New Requests</button>
          <FaChartLine style={{ ...styles.iconBase, color: "#7c3aed", background: "#ede9fe" }} />
        </div>
        <div style={styles.statCard}>
          <p style={styles.subtitle}>Impact</p>
          <h2 style={{ fontSize: "28px", margin: "8px 0" }}>{impactCount.impact}</h2>
          <FaUsers style={{ ...styles.iconBase, color: "#16a34a", background: "#dcfce7" }} />
        </div>
        <div style={styles.statCard}>
          <p style={styles.subtitle}>Total Funds</p>
          <h2 style={{ fontSize: "28px", margin: "8px 0" }}>{formatCurrency(fundRecd.totalFunds)}</h2>
          <FaHeart style={{ ...styles.iconBase, color: "#dc2626", background: "#fee2e2" }} />
        </div>
      </div>

      <div style={styles.middleGrid}>
        <div style={styles.card}>
          <h3 style={{ marginBottom: "10px" }}>Ongoing Requests</h3>
          {activeReqs.length > 0 ? (
            activeReqs.map((req) => {
              const raised = req.amount_collected || 0;
              const goal = req.amount_needed || 1;
              const progressPercent = Math.min((raised / goal) * 100, 100);

              return (
                <div key={req.request_id} style={{ marginTop: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ fontWeight: "600" }}>{req.description}</span>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "8px" }}>
                    <span>₹{raised.toLocaleString()} raised of ₹{goal.toLocaleString()}</span>
                    <span style={{ fontWeight: "bold" }}>{progressPercent.toFixed(0)}%</span>
                  </div>

                  <div style={styles.progressBar}>
                    <div style={{
                      width: `${progressPercent}%`,
                      backgroundColor: progressPercent >= 100 ? "#16a34a" : "#2563eb",
                      height: "100%",
                      transition: "width 0.6s ease-in-out"
                    }}></div>
                  </div>

                  <button 
                    className="btn btn-outline-success btn-sm" 
                    style={{ marginTop: "12px", width: "100%", fontWeight: "600" }}
                    onClick={() => openDonateModal(req)}
                  >
                    Direct Donate
                  </button>
                </div>
              );
            })
          ) : (
            <p style={styles.subtitle}>No active requests undertaken yet.</p>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={{ marginBottom: "10px" }}>Impact Metrics</h3>
          <div style={styles.metricRow}><span>Funding Provided</span><strong>234</strong></div>
          <div style={styles.metricRow}><span>Rations Provided</span><strong>5,678</strong></div>
          <div style={styles.metricRow}><span>Medical Aid</span><strong>145</strong></div>
        </div>
      </div>

  
      {showDonateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Donate to: {selectedReq?.description}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDonateModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Goal:</strong> ₹{selectedReq?.amount_needed}</p>
                <p><strong>Remaining:</strong> ₹{(selectedReq?.amount_needed - (selectedReq?.amount_collected || 0)).toLocaleString()}</p>

                <div className="form-group mt-3">
                  <label>Enter Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                  <br />
                  <div className="form-group mt-3">
                  <input type="text" placeholder="Optional message" value = {donationDesc}
                  onChange={(e)=> setDonationDesc(e.target.value)}></input>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDonateModal(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleDonationSubmit}
                  disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                >
                  Confirm Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;