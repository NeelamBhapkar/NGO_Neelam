import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaCheckCircle, FaRupeeSign, FaSignOutAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BeneficiaryDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || '{}');
  const beneficiaryId = user?.userId;

  // --- State ---
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemId: '', amountNeeded: '', description: '',expiryDate: ''  });
  const [proofFile, setProofFile] = useState(null);
  
  // Notification State (NEW)
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amountNeeded: '', description: '' });
  const [editProofFile, setEditProofFile] = useState(null);

  // Computed Values
  const selectedItem = items.find(i => i.itemId === Number(form.itemId));
  // const isFinancial = selectedItem?.itemName === "Financial Assistance";
  const isFinancial = ["Financial Assistance", "Medical Aid", "Education"]
  .includes(selectedItem?.itemName);
  const hasActiveRequest = requests.some(
    r => ["ACTIVE", "OPEN", "PENDING"].includes(r.requestStatus)
  );


  // --- API Calls ---
  const fetchRequests = () => {
    axios.get(`http://localhost:8080/beneficiary/requests/${beneficiaryId}`)
         .then(res => setRequests(res.data))
         .catch(err => console.error(err));
  };

  // Fetch Notifications (NEW)
  // const fetchNotifications = () => {
  //   axios.get(`http://localhost:8084/api/notifications/beneficiary`)
  //        .then(res => setNotifications(res.data))
  //        .catch(err => console.error("Error fetching notifications:", err));
  // };

  useEffect(() => {
    if (beneficiaryId) {
      fetchRequests();
     // fetchNotifications(); // Call notification fetch on load
    }
    axios.get("http://localhost:8080/beneficiary/items").then(res => setItems(res.data));
  }, [beneficiaryId]);

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      alert("Please upload proof document");
      return;
    }

    if (isFinancial) {
      const amountNumber = Number(form.amountNeeded);
      if (!amountNumber || amountNumber <= 2000) {
        alert("Amount must be greater than 2000 for financial assistances");
        return;
      }
    }

    const formData = new FormData();
    formData.append("beneficiaryId", beneficiaryId);
    formData.append("itemId", form.itemId);
    formData.append("description", form.description);
    formData.append("expiryDate", form.expiryDate);

    formData.append("proof", proofFile);
    if (isFinancial) formData.append("amountNeeded", Number(form.amountNeeded).toString());


    try {
      await axios.post("http://localhost:8080/beneficiary/request", formData);
      alert("Request submitted");
      setForm({ itemId: '', amountNeeded: '', description: '', expiryDate: '' }); setProofFile(null);
      fetchRequests();
    } catch (err) 
    { 
      console.error("Full error details", err.response);
      let errorMessage = "Submission Failed";
      if(err.response && err.response.data === 'string'){
        
        if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
        } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
        } else {
            errorMessage = JSON.stringify(err.response.data);
        }
      }
      alert(errorMessage); }
  };

  const handleUpdate = async (request) => {
    const isFinancialItem = request.item?.itemName === "Financial Assistance";

      {isFinancial && (
  <div className="mb-3">
    <label className="form-label fw-semibold">Amount Needed (₹)</label>
    <input
      type="number"
      className="form-control"
      placeholder="Enter amount"
      min="1"
      value={form.amountNeeded}
      onChange={e => setForm({ ...form, amountNeeded: e.target.value })}
      required={isFinancial} // Dynamically set required
    />
  </div>
)}
    
    
    if (isFinancialItem) {
      const amountNumber = Number(editForm.amountNeeded);
      if (!amountNumber || amountNumber <= 0) {
        alert("Amount must be greater than 0 for financial assistance");
        return;
      }
    }

    const formData = new FormData();
    formData.append("description", editForm.description);
    formData.append("amountNeeded", editForm.amountNeeded);
    if (editProofFile) formData.append("proof", editProofFile);

    try {
      await axios.put(`http://localhost:8080/beneficiary/request/${request.requestId}`, formData);
      setEditingId(null); setEditProofFile(null);
      fetchRequests();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete request?")) {
      await axios.delete(`http://localhost:8080/beneficiary/request/${id}`);
      fetchRequests();
    }
  };

  const handleEditSetup = (r) => {
    setEditingId(r.requestId);
    setEditForm({ amountNeeded: r.amountNeeded || "", description: r.description || "" });
    setEditProofFile(null);
  };

  // Stats Array
  const stats = [
    { title: "Total Requests", val: requests.length, icon: <FaClipboardList />, col: "primary" },
    { title: "Approved", val: requests.filter(r => r.requestStatus === 'APPROVED').length, icon: <FaCheckCircle />, col: "success" },
    { title: "Funds", val: "₹0", icon: <FaRupeeSign />, col: "info" }
  ];

  return (
    <div className="container-fluid min-vh-100 bg-light py-4 position-relative">
      <div className="container">
        
        {/* Header with Notifications */}
        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm">
          <div>
            <h2 className="h4 fw-bold mb-0">Beneficiary Dashboard</h2>
            <small className="text-muted">Manage your aid requests</small>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            <div className="position-relative" style={{cursor: 'pointer'}} onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell size={24} className="text-secondary" />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                  {notifications.length}
                </span>
              )}
            </div>

            <button onClick={() => { sessionStorage.clear(); navigate('/login'); }} className="btn btn-outline-danger d-flex align-items-center gap-2">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Notification Dropdown Panel */}
        {showNotifications && (
          <div className="card shadow-lg position-absolute end-0 me-5 border-0" style={{ width: '350px', zIndex: 1000, top: '90px', right: '80px' }}>
            <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
              <span>Admin Broadcasts</span>
              <button type="button" className="btn-close btn-close-white small" onClick={() => setShowNotifications(false)}></button>
            </div>
            <div className="card-body p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <p className="text-center text-muted py-3 m-0">No new messages</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {notifications.map(n => (
                    <li key={n.notificationId} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong className="text-dark small mb-1">{n.subject}</strong>
                        <small className="text-muted" style={{fontSize: '0.7rem'}}>
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Just now'}
                        </small>
                      </div>
                      <p className="mb-0 text-secondary small">{n.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="col-md-4"><div className="card border-0 shadow-sm p-3 d-flex flex-row justify-content-between align-items-center">
              <div><small className="text-muted fw-bold text-uppercase">{s.title}</small><h3 className="mb-0 fw-bold">{s.val}</h3></div>
              <div className={`p-3 rounded-circle bg-${s.col} bg-opacity-10 text-${s.col}`}>{s.icon}</div>
            </div></div>
          ))}
        </div>

        <div className="row g-4">
          {/* Create Request Form */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100"><div className="card-header bg-white fw-bold py-3">Create Aid Request</div>
              <div className="card-body">
                {hasActiveRequest && <div className="alert alert-warning py-2 small fw-bold">⚠ Active request exists. Please wait.</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <select className="form-select" value={form.itemId} onChange={e => setForm({ ...form, itemId: e.target.value })} required>
                      <option value="">Select Item</option>
                      {items.map(i => <option key={i.itemId} value={i.itemId}>{i.itemName}</option>)}
                    </select>
                  </div>
                  {isFinancial && (
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Amount Needed (₹)"
                        min="1"
                        value={form.amountNeeded}
                        onChange={e => setForm({ ...form, amountNeeded: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="mb-3"><textarea className="form-control" rows="3" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required></textarea></div>
                                  {/* EXPIRY DATE */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Help required till (Expiry Date)
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.expiryDate}
                      onChange={e =>
                        setForm({ ...form, expiryDate: e.target.value })
                      }
                      required
                    />
                    
                  </div>
                  <label className="form-label fw-semibold">
                      Provide Supporting Document
                    </label>
                  
                  <div className="mb-3"><input type="file" className="form-control" accept=".pdf,.jpg,.png" onChange={e => setProofFile(e.target.files[0])} required /></div>
                  <button className={`btn w-100 fw-bold ${hasActiveRequest ? 'btn-secondary' : 'btn-success'}`} disabled={hasActiveRequest}>Submit Request</button>
                </form>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100"><div className="card-header bg-white fw-bold py-3">History</div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light"><tr><th>ID</th><th>Description</th><th>Amount</th><th>Proof</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                  <tbody>
                    {requests.map(r => (
                      <RequestRow key={r.requestId} r={r} isEditing={editingId === r.requestId}
                        editForm={editForm} setEditForm={setEditForm} setEditProofFile={setEditProofFile}
                        onEdit={() => handleEditSetup(r)} onUpdate={() => handleUpdate(r)} 
                        onCancel={() => setEditingId(null)} onDelete={() => handleDelete(r.requestId)} 
                      />
                    ))}
                    {requests.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No requests found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component for Table Row ---
const RequestRow = ({ r, isEditing, editForm, setEditForm, setEditProofFile, onEdit, onUpdate, onCancel, onDelete }) => {
  const isFinancial = r.item?.itemName === "Financial Assistance";
  const canModify = !['APPROVED', 'FULFILLED', 'CLOSED','REJECTED'].includes(r.requestStatus);
  const statusColors = { APPROVED: 'success', PENDING: 'warning', REJECTED: 'danger' };

  if (isEditing) {
    return (
      <tr className="bg-light">
        <td>{r.requestId}</td>
        <td><input className="form-control form-control-sm" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></td>
        <td>{isFinancial ? <input type="number" className="form-control form-control-sm" style={{width:80}} min="1" value={editForm.amountNeeded} onChange={e => setEditForm({ ...editForm, amountNeeded: e.target.value })} /> : "-"}</td>
        <td><input type="file" className="form-control form-control-sm" onChange={e => setEditProofFile(e.target.files[0])} /></td>
        <td><span className="badge bg-secondary">Editing</span></td>
        <td className="text-end">
          <button className="btn btn-sm btn-success me-1" onClick={onUpdate}>Save</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Cancel</button>
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td className="fw-bold text-muted">#{r.requestId}</td>
      <td>{r.description}</td>
      <td className="fw-bold">{isFinancial ? `₹${r.amountNeeded}` : "-"}</td>
      <td>{r.proofDocument ? <button className="btn btn-sm btn-link p-0 text-decoration-none" onClick={() => window.open(`http://localhost:8080/beneficiary/proof/${r.proofDocument}`, "_blank")}>View</button> : "-"}</td>
      <td><span className={`badge bg-${statusColors[r.requestStatus] || 'secondary'} bg-opacity-25 text-${statusColors[r.requestStatus] || 'secondary'}`}>{r.requestStatus}</span></td>
      <td className="text-end">
        <button className="btn btn-sm btn-outline-primary me-1" disabled={!canModify} onClick={onEdit}>Edit</button>
        {/* <button className="btn btn-sm btn-outline-danger" disabled={!canModify} onClick={onDelete}>Delete</button> */}
      </td>
    </tr>
  );
};

export default BeneficiaryDashboard;