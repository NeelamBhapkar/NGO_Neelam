import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, FaChartLine, FaDollarSign, FaFileInvoice, 
  FaSignOutAlt, FaHandHoldingHeart, FaTimes, FaBell,
  FaBuilding, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaEnvelope
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // --- States (Existing) ---
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDonated, setTotalDonated] = useState(0);
  const [livesImpacted, setLivesImpacted] = useState(0);

  // --- States (Notification) ---
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // --- States (Donation Modal) ---
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDescription, setDonationDescription] = useState('');

  // --- States (NGOs - NEW) ---
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [showNgoModal, setShowNgoModal] = useState(false);

  // --- Fetch Data ---
  const fetchData = () => {
    setLoading(true);

    // 1. Fetch Approved Requests
    fetch("http://localhost:8086/api/donor/approved-requests")
      .then((res) => res.json())
      .then((data) => {
        setApprovedRequests(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching approved requests:", err);
        setLoading(false);
      });

    // 2. Fetch All NGOs (NEW)
    fetch("http://localhost:8086/api/donor/ngos")
      .then((res) => res.json())
      .then((data) => setNgos(data || []))
      .catch((err) => console.error("Error fetching NGOs:", err));

    if (user.userId) {
      // 3. Total Donated
      fetch(`http://localhost:8086/api/donor/total-donated/${user.userId}`)
        .then((res) => res.json())
        .then((data) => setTotalDonated(data || 0))
        .catch((err) => console.error("Error fetching total:", err));

      // 4. Donation Count
      fetch(`http://localhost:8086/api/donor/donation-count/${user.userId}`)
        .then((res) => res.json())
        .then((data) => setLivesImpacted(data || 0))
        .catch((err) => console.error("Error fetching count:", err));

      // 5. Notifications
      fetch(`http://localhost:8086/api/notifications/role/3`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setNotifications(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Notification service unavailable", err));
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.userId]);

  const stats = [
    { title: "Total Donated", value: `₹${totalDonated}`, icon: <FaHeart />, iconColor: "text-danger", bg: "bg-danger bg-opacity-10" },
    { title: "Donations Made", value: livesImpacted, icon: <FaChartLine />, iconColor: "text-primary", bg: "bg-primary bg-opacity-10" },
    { title: "Lives Impacted", value: livesImpacted, icon: <FaDollarSign />, iconColor: "text-success", bg: "bg-success bg-opacity-10" },
    { title: "Receipts Generated", value: livesImpacted, icon: <FaFileInvoice />, iconColor: "text-primary", bg: "bg-info bg-opacity-10" },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  // --- Donation Handlers ---
  const handleDonateClick = (req) => {
    setSelectedRequest(req);
    setDonationAmount(req.amount_needed);
    setDonationDescription('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    if (!user.userId || !selectedRequest) return;

    const donationData = {
      userId: user.userId,
      requestId: selectedRequest.request_id,
      itemId: selectedRequest.item?.item_id,
      amount: parseFloat(donationAmount),
      description: donationDescription
    };

    fetch("http://localhost:8086/api/donor/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationData)
    })
    .then(async (res) => {
      if (res.ok) {
        alert("Donation Successful!");
        handleCloseModal();
        fetchData();
      } else {
        alert("Donation Failed.");
      }
    })
    .catch(err => console.error(err));
  };

  // --- NGO Handlers (NEW) ---
  const handleNgoClick = (ngo) => {
    setSelectedNgo(ngo);
    setShowNgoModal(true);
  };

  const handleCloseNgoModal = () => {
    setShowNgoModal(false);
    setSelectedNgo(null);
  };

  return (
    <div className="container-fluid min-vh-100 bg-light py-5 position-relative">
      <div className="container">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5 bg-white p-4 rounded shadow-sm">
          <div>
            <h1 className="h3 mb-1 fw-bold text-dark">Donor Dashboard</h1>
            <p className="text-muted mb-0">Welcome back, <strong className="text-primary">{user.username || "Donor"}</strong></p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* NOTIFICATION COMPONENT */}
            <div className="position-relative">
              <button 
                className="btn btn-light rounded-circle p-2 border shadow-sm"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <FaBell className="text-primary" style={{ fontSize: '1.4rem' }} />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.65rem'}}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="position-absolute end-0 mt-2 bg-white shadow-lg rounded border" style={{ width: '300px', zIndex: 1050 }}>
                  <div className="p-3 border-bottom fw-bold bg-light">Notifications</div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-muted small">No new updates</div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="p-3 border-bottom small">
                          {n.message}
                          <div className="text-muted" style={{fontSize: '0.7rem'}}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="btn btn-outline-danger d-flex align-items-center gap-2 fw-semibold">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-4 mb-5">
          {stats.map((stat, index) => (
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

        <div className="row g-4 mb-5">
          {/* REQUESTS LIST */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                <h4 className="card-title fw-bold mb-1">Live Donation Opportunities</h4>
              </div>
              <div className="card-body p-4">
                {loading ? (
                  <p className="text-center text-muted">Loading...</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {approvedRequests.map((req) => (
                      <div key={req.request_id} className="p-3 border rounded bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0 fw-bold">{req.beneficiary?.username}</h6>
                          <p className="text-muted small mb-1">{req.description}</p>
                          <small className="text-secondary fw-bold">Target: ₹{req.amount_needed}</small>
                        </div>
                        <button onClick={() => handleDonateClick(req)} className="btn btn-sm btn-primary px-3">
                          <FaHandHoldingHeart /> Donate
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: IMPACT & NGOS */}
          <div className="col-lg-5 d-flex flex-column gap-4">
            {/* Impact Card */}
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-3">Your Impact</h4>
              <div className="bg-danger bg-opacity-10 p-4 rounded text-center">
                <h2 className="text-danger fw-bold mb-0">₹{totalDonated}</h2>
                <p className="text-danger small mb-0 fw-semibold">Total Contribution</p>
              </div>
            </div>

            {/* REGISTERED NGOS LIST (NEW SECTION) */}
            <div className="card border-0 shadow-sm flex-grow-1">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="card-title fw-bold mb-1 d-flex align-items-center gap-2">
                  <FaBuilding className="text-warning" /> Registered NGOs
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-2" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {ngos.length === 0 ? (
                    <p className="text-muted small">No NGOs found.</p>
                  ) : (
                    ngos.map((ngo) => (
                      <div 
                        key={ngo.user_id} 
                        className="p-3 border rounded bg-white hover-shadow cursor-pointer d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => handleNgoClick(ngo)}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-warning bg-opacity-10 p-2 rounded-circle text-warning">
                            <FaBuilding />
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold small">{ngo.username}</h6>
                            <span className="text-muted" style={{fontSize: '0.75rem'}}>
                              {ngo.city?.cityName || ngo.address || "Location N/A"}
                            </span>
                          </div>
                        </div>
                        <FaInfoCircle className="text-secondary" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DONATION MODAL (Existing) */}
      {showModal && selectedRequest && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow p-4">
               <div className="d-flex justify-content-between align-items-center mb-3">
                 <h5 className="fw-bold m-0">Complete Donation</h5>
                 <button className="btn-close" onClick={handleCloseModal}></button>
               </div>
               <form onSubmit={handleSubmitDonation}>
                 <div className="mb-3">
                   <label className="small fw-bold">Amount (₹)</label>
                   <input type="number" className="form-control" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} required />
                 </div>
                 <div className="mb-3">
                   <label className="small fw-bold">Message</label>
                   <textarea className="form-control" value={donationDescription} onChange={(e) => setDonationDescription(e.target.value)} required />
                 </div>
                 <button type="submit" className="btn btn-primary w-100 fw-bold">Confirm</button>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* NGO DETAILS MODAL (NEW) */}
      {showNgoModal && selectedNgo && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
               <div className="modal-header border-bottom-0 bg-warning bg-opacity-10">
                 <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                   <FaBuilding /> {selectedNgo.username}
                 </h5>
                 <button className="btn-close" onClick={handleCloseNgoModal}></button>
               </div>
               <div className="modal-body p-4">
                 <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <FaEnvelope className="text-secondary" />
                        <div>
                            <small className="text-muted d-block">Email</small>
                            <span className="fw-semibold">{selectedNgo.email}</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <FaPhone className="text-secondary" />
                        <div>
                            <small className="text-muted d-block">Contact</small>
                            <span className="fw-semibold">{selectedNgo.phoneNo || "N/A"}</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <FaMapMarkerAlt className="text-secondary" />
                        <div>
                            <small className="text-muted d-block">Address</small>
                            <span className="fw-semibold">
                                {selectedNgo.address}
                                {selectedNgo.city ? `, ${selectedNgo.city.cityName}` : ''}
                                {selectedNgo.state ? `, ${selectedNgo.state.stateName}` : ''}
                            </span>
                        </div>
                    </div>
                    {selectedNgo.regNo && (
                        <div className="alert alert-light border mt-2 mb-0">
                            <small className="text-muted">Registration No:</small> <strong>{selectedNgo.regNo}</strong>
                        </div>
                    )}
                 </div>
               </div>
               <div className="modal-footer border-top-0 pt-0">
                 <button className="btn btn-secondary w-100" onClick={handleCloseNgoModal}>Close</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .hover-shadow:hover { box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15)!important; }
        `}
      </style>
    </div>
  );
};

export default DonorDashboard;