import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Requests
  const fetchRequests = () => {
    fetch("http://localhost:5096/api/Admin/pending-users")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Verify (Approve)
  const handleVerify = async (userId) => {
    if (!window.confirm("Are you sure you want to verify this user?")) return;

    try {
      const response = await fetch(`http://localhost:5096/api/Admin/approve/${userId}`, {
        method: 'PUT'
      });
      if (response.ok) {
        alert("User Verified Successfully!");
        fetchRequests(); // Refresh list
      } else {
        alert("Failed to verify user.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Reject (Delete)
  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to REJECT and DELETE this user?")) return;

    try {
      const response = await fetch(`http://localhost:5096/api/Admin/reject/${userId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert("User Rejected and Deleted.");
        fetchRequests(); // Refresh list
      } else {
        alert("Failed to reject user.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/admin-dashboard')}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="mb-0 fw-bold">Pending NGO Verification Requests</h2>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email / Phone</th>
                  <th className="p-3">PAN Number</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center p-4">Loading requests...</td></tr>
                ) : requests.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-4 text-muted">No pending approvals found.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.userId}>
                      <td className="p-3 fw-bold">{req.username}</td>
                      <td className="p-3">
                        <div>{req.email}</div>
                        <small className="text-muted">{req.phoneNo}</small>
                      </td>
                      <td className="p-3 font-monospace">{req.panNo}</td>
                      <td className="p-3">{req.location}</td>
                      <td className="p-3 text-center">
                        <span className="badge bg-warning text-dark">Under Verification</span>
                      </td>
                      <td className="p-3 text-end">
                        <button 
                          className="btn btn-sm btn-success me-2" 
                          onClick={() => handleVerify(req.userId)}
                          title="Verify User"
                        >
                          <FaCheck /> Verify
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleReject(req.userId)}
                          title="Reject & Delete"
                        >
                          <FaTimes /> Reject
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
  );
};

export default PendingApprovals;