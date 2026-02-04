import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaArrowLeft, FaCalendarAlt } from "react-icons/fa";

const ViewRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get the filter from navigation state (defaults to "OPEN" if undefined)
  // Passed from NgoDashboard via: navigate("/view-requests", { state: { filter: "OPEN" } })
  const filterType = location.state?.filter || "OPEN";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- API CALL: FETCH REQUESTS ---
  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Connects to your Spring Boot Controller: @GetMapping("/requests/{status}")
      const response = await fetch(`http://localhost:8083/api/ngo/requests/${filterType}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      // Optional: Add user feedback here (e.g., toast notification)
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the filterType changes (e.g., switching from Pending to Active)
  useEffect(() => {
    fetchRequests();
  }, [filterType]);

  // --- API CALL: UPDATE STATUS ---
  const handleAction = async (id, newStatus) => {
    const actionName = newStatus === "APPROVED" ? "Approve" : "Reject";
    
    if (window.confirm(`Are you sure you want to ${actionName} this request?`)) {
      try {
        // Connects to your Spring Boot Controller: @PutMapping("/update-status/{requestId}")
        const response = await fetch(`http://localhost:8083/api/ngo/update-status/${id}?status=${newStatus}`, {
          method: "PUT",
        });

        if (response.ok) {
          alert(`Request ${newStatus} successfully!`);
          // Refresh the list to remove the processed item
          fetchRequests(); 
        } else {
          alert("Failed to update status. Please try again.");
        }
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: "#f6faf8", minHeight: "100vh" }}>
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-dark me-3 d-flex align-items-center gap-2 shadow-sm bg-white border-0" 
          onClick={() => navigate("/ngo-dashboard")}
        >
          <FaArrowLeft /> Back
        </button>
        <div>
          <h2 className="fw-bold mb-0">
            {filterType === "OPEN" ? "Pending Approvals" : "Active Beneficiary Requests"}
          </h2>
          <p className="text-muted small mb-0">
            {filterType === "OPEN" 
              ? "Review and approve funding requests below" 
              : "Track currently active and approved campaigns"}
          </p>
        </div>
      </div>

      {/* REQUESTS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading requests...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-secondary">
                <tr>
                  <th className="ps-4 py-3 text-uppercase small fw-bold">ID</th>
                  <th className="py-3 text-uppercase small fw-bold">Description</th>
                  <th className="py-3 text-uppercase small fw-bold">Amount Needed</th>
                  <th className="py-3 text-uppercase small fw-bold">Date</th>
                  <th className="py-3 text-uppercase small fw-bold">Status</th>
                  {/* Only show Actions column if we are viewing OPEN requests */}
                  {filterType === "OPEN" && (
                    <th className="py-3 text-center text-uppercase small fw-bold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.requestId}>
                      <td className="ps-4 fw-bold text-primary">#{req.requestId}</td>
                      
                      {/* Description (from DB column: description) */}
                      <td>
                        <span className="d-inline-block text-truncate fw-semibold text-dark" style={{ maxWidth: "300px" }} title={req.description}>
                          {req.description || "No description provided"}
                        </span>
                      </td>

                      {/* Amount (from DB column: amount_needed) */}
                      <td className="fw-bold text-secondary">
                        {formatCurrency(req.amountNeeded)}
                      </td>

                      {/* Date (from DB column: request_date) */}
                      <td className="text-muted small">
                        <FaCalendarAlt className="me-1 mb-1" />
                        {formatDate(req.requestDate)}
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 ${
                          req.requestStatus === 'OPEN' ? 'bg-warning text-dark' : 
                          req.requestStatus === 'APPROVED' ? 'bg-success' : 
                          'bg-danger'
                        }`}>
                          {req.requestStatus}
                        </span>
                      </td>

                      {/* Action Buttons - Only visible for OPEN requests */}
                      {filterType === "OPEN" && (
                        <td className="text-center">
                          <button 
                            className="btn btn-success btn-sm me-2 rounded-3 shadow-sm fw-bold"
                            style={{ minWidth: "90px" }}
                            onClick={() => handleAction(req.requestId, "APPROVED")}
                          >
                            <FaCheck className="me-1" /> Approve
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm rounded-3 shadow-sm fw-bold"
                            style={{ minWidth: "90px" }}
                            onClick={() => handleAction(req.requestId, "REJECTED")}
                          >
                            <FaTimes className="me-1" /> Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={filterType === "OPEN" ? 6 : 5} className="text-center py-5">
                      <div className="d-flex flex-column align-items-center opacity-50">
                        <div className="bg-light rounded-circle p-3 mb-3">
                          <FaCheck size={30} className="text-muted" />
                        </div>
                        <h5 className="text-muted fw-bold">No requests found</h5>
                        <p className="small text-muted mb-0">
                          There are currently no {filterType.toLowerCase()} requests in the system.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequests;