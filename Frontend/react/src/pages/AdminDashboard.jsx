import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsersCog, FaClipboardCheck, FaUsers, FaSignOutAlt, 
  FaBoxes, FaHandHoldingHeart, FaBuilding, FaUserInjured,
  FaBullhorn, FaTimes, FaPaperPlane, FaEdit, FaTrash, FaHistory,
  FaBars, FaHome, FaTachometerAlt, FaUserCircle, FaSave
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  // 1. Read from Session Storage
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  // Existing State
  const [pendingCount, setPendingCount] = useState(0);
  const [userStats, setUserStats] = useState({ 
    total: 0, 
    ngos: 0, 
    donors: 0, 
    beneficiaries: 0 
  });

  // --- Broadcast Management State ---
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editId, setEditId] = useState(null); 
  
  const [broadcastForm, setBroadcastForm] = useState({ 
    subject: '', 
    message: '', 
    targetRoleId: '' 
  });
  const [sending, setSending] = useState(false);

  // --- NEW: Account Management State ---
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phoneNo: '',
    password: '' // Optional new password
  });

  // 2. Fetch Data
  const fetchData = () => {
    fetch("http://localhost:5096/api/Admin/pending-count")
      .then((res) => res.json())
      .then((data) => setPendingCount(data))
      .catch((err) => console.error("Error fetching pending count:", err));

    fetch("http://localhost:5096/api/Admin/total-users-count")
      .then((res) => res.json())
      .then((data) => setUserStats(data))
      .catch((err) => console.error("Error fetching total users:", err));

    fetch("http://localhost:5096/api/Admin/broadcasts")
      .then((res) => res.json())
      .then((data) => setBroadcasts(data))
      .catch((err) => console.error("Error fetching broadcasts:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- NEW: Fetch Admin Details ---
  const fetchAdminDetails = async () => {
    if (!user.userId) return;
    try {
      const res = await fetch(`http://localhost:5096/api/Admin/me/${user.userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfileForm({
          username: data.username,
          email: data.email,
          phoneNo: data.phoneNo,
          password: '' // Reset password field
        });
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // --- NEW: Update Admin Profile ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!window.confirm("Save changes to your profile?")) return;

    try {
      const res = await fetch(`http://localhost:5096/api/Admin/update-profile/${user.userId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        // Update session storage username if changed
        const updatedUser = { ...user, username: profileForm.username };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setShowProfileModal(false);
        window.location.reload(); // Refresh to show new name
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  // --- NEW: Delete Admin Account ---
  const handleDeleteAccount = async () => {
    const confirmMsg = "WARNING: This action is permanent! Are you sure you want to delete your admin account?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`http://localhost:5096/api/Admin/delete-account/${user.userId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert("Account deleted. Redirecting to login...");
        handleLogout();
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  // --- Handle Create OR Edit (Broadcast) ---
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    const payload = {
      ...broadcastForm,
      targetRoleId: broadcastForm.targetRoleId === '' ? null : parseInt(broadcastForm.targetRoleId)
    };

    const url = isEditing 
      ? `http://localhost:5096/api/Admin/edit-broadcast/${editId}` 
      : "http://localhost:5096/api/Admin/broadcast";
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(isEditing ? "Broadcast updated!" : "Broadcast message sent!");
        resetModal();
        fetchData(); 
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing request.");
    } finally {
      setSending(false);
    }
  };

  // --- Helpers ---
  const handleEditClick = (item) => {
    setBroadcastForm({
      subject: item.subject,
      message: item.message,
      targetRoleId: item.targetRoleId === null ? '' : item.targetRoleId
    });
    setEditId(item.notificationId);
    setIsEditing(true);
    setShowBroadcast(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this broadcast?")) return;

    try {
      const res = await fetch(`http://localhost:5096/api/Admin/delete-broadcast/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetModal = () => {
    setBroadcastForm({ subject: '', message: '', targetRoleId: '' });
    setIsEditing(false);
    setEditId(null);
    setShowBroadcast(false);
  };

  // --- REUSABLE SIDEBAR CONTENT ---
  const SidebarContent = () => (
    <div className="d-flex flex-column h-100 p-3 text-white bg-dark justify-content-between">
      <div>
        {/* Profile Info */}
        <div className="d-flex align-items-center gap-3 mb-4 px-2 pt-2">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.username || 'Admin'}&background=0d6efd&color=fff&size=128`} 
            alt="Profile" 
            className="rounded-circle border border-2 border-secondary"
            style={{ width: '48px', height: '48px' }}
          />
          <div style={{ lineHeight: '1.2' }}>
            <h6 className="mb-0 fw-bold">{user.username}</h6>
            <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Administrator</small>
          </div>
        </div>

        <hr className="text-secondary" />

        {/* Navigation Links */}
        <ul className="nav nav-pills flex-column gap-2">
          <li className="nav-item">
            <button className="nav-link active d-flex align-items-center gap-3 w-100 text-start fw-semibold shadow-sm" onClick={() => navigate('/admin-dashboard')}>
              <FaHome /> Dashboard
            </button>
          </li>
          <li>
            <button className="nav-link text-white-50 d-flex align-items-center gap-3 w-100 text-start fw-semibold hover-effect" onClick={() => navigate('/admin/pending-approvals')}>
              <FaClipboardCheck /> Approvals 
              {pendingCount > 0 && <span className="badge bg-danger rounded-pill ms-auto">{pendingCount}</span>}
            </button>
          </li>
          <li>
            <button className="nav-link text-white-50 d-flex align-items-center gap-3 w-100 text-start fw-semibold hover-effect" onClick={() => navigate('/admin/users')}>
              <FaUsersCog /> User Management
            </button>
          </li>
          <li>
            <button className="nav-link text-white-50 d-flex align-items-center gap-3 w-100 text-start fw-semibold hover-effect" onClick={() => navigate('/admin/categories')}>
              <FaBoxes /> Donation Categories
            </button>
          </li>
          <li>
            <button className="nav-link text-white-50 d-flex align-items-center gap-3 w-100 text-start fw-semibold hover-effect" onClick={() => { resetModal(); setShowBroadcast(true); }}>
              <FaBullhorn /> Broadcast Message
            </button>
          </li>
        </ul>
      </div>
      
      {/* Bottom Section: Manage Account & Logout */}
      <div>
        {/* Manage Account Button */}
        <button 
          className="nav-link text-white-50 d-flex align-items-center gap-3 w-100 text-start fw-semibold hover-effect mb-2" 
          onClick={fetchAdminDetails}
        >
          <FaUserCircle /> Manage Account
        </button>

        <hr className="text-secondary" />
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 fw-bold">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    // 1. ROOT CONTAINER: vh-100 (Full Viewport Height) + overflow-hidden (Prevents Body Scroll)
    <div className="d-flex vh-100 bg-light overflow-hidden">
      
      {/* --- SIDEBAR (DESKTOP) --- */}
      {/* 2. SIDEBAR CONTAINER: h-100 (Full height of parent) */}
      <div className="d-none d-lg-block flex-shrink-0 bg-dark h-100" style={{ width: '260px' }}>
        <SidebarContent />
      </div>

      {/* --- SIDEBAR (MOBILE OFFCONVAS) --- */}
      <div className="offcanvas offcanvas-start bg-dark" tabIndex="-1" id="sidebarMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-white fw-bold">Menu</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* 3. RIGHT SIDE: Flex column, full height, no overflow on wrapper itself */}
      <div className="d-flex flex-column flex-grow-1 h-100 overflow-hidden">
        
        {/* --- BROADCAST MODAL --- */}
        {showBroadcast && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="card shadow-lg border-0" style={{ width: '90%', maxWidth: '500px' }}>
              <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center p-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-primary">
                  <FaBullhorn /> {isEditing ? "Edit Broadcast" : "New Broadcast"}
                </h5>
                <button onClick={resetModal} className="btn btn-sm btn-light rounded-circle">
                  <FaTimes />
                </button>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleBroadcastSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Target Audience</label>
                    <select 
                      className="form-select"
                      value={broadcastForm.targetRoleId}
                      onChange={(e) => setBroadcastForm({...broadcastForm, targetRoleId: e.target.value})}
                    >
                      <option value="">All Users</option> 
                      <option value="2">NGOs Only</option>
                      <option value="3">Donors Only</option>
                      <option value="4">Beneficiaries Only</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Subject</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Important Update"
                      value={broadcastForm.subject}
                      onChange={(e) => setBroadcastForm({...broadcastForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Message</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Type your message here..."
                      value={broadcastForm.message}
                      onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" onClick={resetModal} className="btn btn-light fw-bold text-secondary">Cancel</button>
                    <button type="submit" className="btn btn-primary fw-bold d-flex align-items-center gap-2" disabled={sending}>
                      <FaPaperPlane /> {sending ? "Saving..." : (isEditing ? "Update" : "Send")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- ACCOUNT MANAGEMENT MODAL (NEW) --- */}
        {showProfileModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
            <div className="card shadow-lg border-0" style={{ width: '90%', maxWidth: '500px' }}>
              <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center p-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-dark">
                  <FaUsersCog className="text-primary"/> Manage Account
                </h5>
                <button onClick={() => setShowProfileModal(false)} className="btn btn-sm btn-light rounded-circle">
                  <FaTimes />
                </button>
              </div>
              <div className="card-body p-4 pt-0">
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Username</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Email</label>
                      <input 
                        type="email" 
                        className="form-control"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Phone</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={profileForm.phoneNo}
                        onChange={(e) => setProfileForm({...profileForm, phoneNo: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">New Password (Optional)</label>
                    <input 
                      type="password" 
                      className="form-control"
                      placeholder="Leave blank to keep current"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                    />
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <button type="button" onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
                      <FaTrash /> Delete Account
                    </button>
                    <div className="d-flex gap-2">
                      <button type="button" onClick={() => setShowProfileModal(false)} className="btn btn-light fw-bold text-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary fw-bold d-flex align-items-center gap-2">
                        <FaSave /> Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- SCROLLABLE DASHBOARD CONTENT AREA --- */}
        {/* 4. THIS DIV WRAPS THE DASHBOARD CONTENT AND IS THE ONLY THING THAT SCROLLS */}
        <div className="flex-grow-1 overflow-auto p-4">
          
          {/* Header Section */}
          <header className="d-flex justify-content-between align-items-center mb-4 mb-md-5 p-3 p-md-4 bg-white rounded shadow-sm">
            
            {/* Left: Mobile Toggle + Title */}
            <div className="d-flex align-items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <button className="btn btn-outline-secondary d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
                <FaBars />
              </button>

              <div>
                <h2 className="h4 mb-0 text-dark fw-bold">Dashboard Overview</h2>
                <p className="text-muted mb-0 small">
                  Here is what's happening with your platform today.
                </p>
              </div>
            </div>

            {/* Right: Broadcast Button Only (Logout removed) */}
            <div>
              <button 
                onClick={() => { resetModal(); setShowBroadcast(true); }} 
                className="btn btn-primary d-flex align-items-center gap-2 px-3 shadow-sm"
              >
                <FaBullhorn /> <span className="d-none d-md-inline">New Broadcast</span>
              </button>
            </div>
          </header>
          
          {/* Dashboard Grid */}
          <div className="row g-3 g-md-4 mb-5">
            
            {/* Tile 1: Pending Approvals */}
            <div className="col-12 col-md-4">
              <div 
                className="card border-0 shadow-sm h-100 cursor-pointer user-select-none"
                onClick={() => navigate('/admin/pending-approvals')}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #198754' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2 gap-md-3">
                      <div className="bg-success bg-opacity-10 p-2 p-md-3 rounded-circle">
                        <FaClipboardCheck size={24} className="text-success" />
                      </div>
                      <h5 className="card-title mb-0 text-secondary fs-6 fs-md-5">Pending Approvals</h5>
                    </div>
                    {pendingCount > 0 && (
                      <span className="badge bg-danger rounded-pill px-2 py-1 px-md-3 py-md-2 shadow-sm text-wrap text-center" 
                            style={{ fontSize: '0.7rem', animation: 'pulse 2s infinite', maxWidth: '80px' }}>
                        Action Needed
                      </span>
                    )}
                  </div>
                  <h2 className="display-5 fw-bold text-success mb-0">{pendingCount}</h2>
                  <small className="text-muted">Requests waiting for review</small>
                  <div className="mt-3 text-end">
                     <small className="fw-bold text-success">Review Requests →</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2: Total Users */}
            <div className="col-12 col-md-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 p-md-3 rounded-circle">
                        <FaUsers size={24} className="text-primary" />
                      </div>
                      <div>
                        <h5 className="card-title mb-0 text-dark fw-bold fs-5">Total Registered Users</h5>
                        <small className="text-muted">Active accounts across all roles</small>
                      </div>
                    </div>
                    <h2 className="display-5 fw-bold text-primary mb-0">{userStats.total}</h2>
                  </div>
                  <div className="row text-center g-3">
                    <div className="col-4 border-end">
                      <div className="d-flex flex-column align-items-center">
                        <FaBuilding className="text-warning mb-2" size={20} />
                        <h4 className="fw-bold text-dark mb-0">{userStats.ngos}</h4>
                        <small className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>NGOs</small>
                      </div>
                    </div>
                    <div className="col-4 border-end">
                      <div className="d-flex flex-column align-items-center">
                        <FaHandHoldingHeart className="text-success mb-2" size={20} />
                        <h4 className="fw-bold text-dark mb-0">{userStats.donors}</h4>
                        <small className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Donors</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="d-flex flex-column align-items-center">
                        <FaUserInjured className="text-info mb-2" size={20} />
                        <h4 className="fw-bold text-dark mb-0">{userStats.beneficiaries}</h4>
                        <small className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Beneficiaries</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 3: User Management */}
            <div className="col-12 col-md-6">
              <div 
                className="card border-0 shadow-sm h-100 cursor-pointer user-select-none"
                onClick={() => navigate('/admin/users')}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #6366f1' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3 mb-3">
                    <div className="bg-indigo bg-opacity-10 p-2 p-md-3 rounded-circle" style={{ backgroundColor: '#e0e7ff' }}>
                      <FaUsersCog size={24} style={{ color: '#6366f1' }} />
                    </div>
                    <h5 className="card-title mb-0 text-dark fw-bold fs-6 fs-md-5">Account Management</h5>
                  </div>
                  <p className="card-text text-secondary mb-0">
                    View, edit, or delete user accounts and manage roles.
                  </p>
                  <div className="mt-3 text-end">
                      <small className="fw-bold" style={{ color: '#6366f1' }}>Manage Users →</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 4: Donation Categories */}
            <div className="col-12 col-md-6">
              <div 
                className="card border-0 shadow-sm h-100 cursor-pointer user-select-none"
                onClick={() => navigate('/admin/categories')}
                style={{ cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '5px solid #f59e0b' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3 mb-3">
                    <div className="bg-warning bg-opacity-10 p-2 p-md-3 rounded-circle">
                      <FaBoxes size={24} className="text-warning" />
                    </div>
                    <h5 className="card-title mb-0 text-dark fw-bold fs-6 fs-md-5">Donation Categories</h5>
                  </div>
                  <p className="card-text text-secondary mb-0">
                    Add, remove, or update donation item categories.
                  </p>
                  <div className="mt-3 text-end">
                      <small className="fw-bold text-warning">Manage Categories →</small>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- Broadcast History Table --- */}
          <div className="row pb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3 border-0">
                  <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-dark">
                    <FaHistory className="text-secondary"/> Recent Broadcasts
                  </h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 text-secondary small text-uppercase">Date</th>
                        <th className="px-4 text-secondary small text-uppercase">Target</th>
                        <th className="px-4 text-secondary small text-uppercase">Subject</th>
                        <th className="px-4 text-secondary small text-uppercase w-50">Message</th>
                        <th className="px-4 text-end text-secondary small text-uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {broadcasts.length === 0 ? (
                        <tr><td colSpan="5" className="text-center p-4 text-muted">No broadcasts sent yet.</td></tr>
                      ) : (
                        broadcasts.map((b) => (
                          <tr key={b.notificationId}>
                            <td className="px-4 text-muted small">{new Date(b.createdAt).toLocaleDateString()}</td>
                            <td className="px-4">
                              <span className="badge bg-secondary bg-opacity-10 text-secondary border px-2 py-1">
                                {b.roleName}
                              </span>
                            </td>
                            <td className="px-4 fw-bold text-dark">{b.subject}</td>
                            <td className="px-4 text-muted text-truncate" style={{maxWidth: '300px'}} title={b.message}>
                              {b.message}
                            </td>
                            <td className="px-4 text-end">
                              <button 
                                className="btn btn-sm btn-outline-primary me-2" 
                                onClick={() => handleEditClick(b)} 
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => handleDeleteClick(b.notificationId)} 
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>
        {`
          .hover-effect:hover { background-color: rgba(255, 255, 255, 0.1); color: #fff !important; }
          .hover-card { transition: transform 0.2s, box-shadow 0.2s; }
          .hover-card:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
          .pulse-badge { animation: pulse 2s infinite; }
          @keyframes pulse { 
            0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); } 
            70% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); } 
            100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } 
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;