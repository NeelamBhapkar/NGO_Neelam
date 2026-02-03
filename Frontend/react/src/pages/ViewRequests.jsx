
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FetchRequest() {
    const navigate = useNavigate();
    const [requests, setRequest] = useState([]);
    const location = useLocation();
    const [statusFilter, setStatusFilter] = useState(location.state?.filter || "PENDING")
    // for individual view details button
    const [selectedReq, setReq] = useState();
    //const UpdateReq = ({ benefId }) => 

    const changeStatus = async (newStatus) => {
        if(!selectedReq)
            return;
        console.log(selectedReq)
        const msg = newStatus === "APPROVED" ? "Approve":"Reject";
        // if(!window.confirm(`Are you sure, you want to ${newStatus}? this request`))    
        //     return;
        if(newStatus === "APPROVED")
        {
            if(!window.confirm(`Are you sure, you want to Approve? this request`))
                return;
        }
        else if(newStatus==="REJECTED"){
            if(!window.confirm("Are you suree want to Reject this request?"))
                return;

        }
        try {
                const response = await fetch(`http://localhost:8083/api/ngo/update/${selectedReq.request_id}/${newStatus}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (response.ok){
                    alert(`Request ${newStatus} sucessfully`)
                    window.location.reload();
                }
                else{
                    alert("Failed to"+{newStatus}+ "the request");
                }
            }
            catch (error) {
                console.log(error);
            }

        }

    useEffect(() => {
        if (!statusFilter)
            return;
        fetch(`http://localhost:8083/api/ngo/getAll/${statusFilter}`)
            .then(resp => {
                if (resp.ok)
                    return resp.json();
                else
                    return []
            })
            .then(data => setRequest(data))
            .catch(err => {
                console.log("Failed to fetch data", err);
                setRequest([]);
            });

    }, [statusFilter])
    // for approving the request by ngo
    const updateStatus = ({ requests })
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Beneficiary Requests</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back to Dashboard
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-bordered shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>Amount Needed</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((req, index) => (
                                <tr key={req.request_id}>
                                    <td>{index + 1}</td>
                                    <td>{req.description}</td>
                                    <td>

                                        {req.amount_needed ? `${req.amount_needed}` : "Physical Items"}
                                    </td>
                                    <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${req.request_status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {req.request_status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setReq(req)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No active requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div>
                                <>
                                    <p>Date raised: <b>{selectedReq?.request_date}</b></p>
                                    <p><strong>Description:</strong> {selectedReq?.description}</p>
                                    <p><strong>Requested By:</strong> {selectedReq?.user?.username}</p>
                                    <p><strong>Contact Details:</strong> <a href={"mailto:" + selectedReq?.user?.email}>{selectedReq?.user?.email}</a></p>
                                    <p><strong>Phone:</strong> {selectedReq?.user?.phone_no}</p>
                                    <p><strong>Address:</strong> {selectedReq?.user?.address}</p>
                                    <button type="button" className="btn btn-primary" onClick={() => window.open(`http://localhost:8083/uploads/${selectedReq?.proof_document}`, '_blank')}>View Supporting Document</button>
                                </>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" onClick={() => changeStatus("REJECTED")}>Reject</button>
                            <button type="button" class="btn btn-success" onClick={()=>changeStatus("APPROVED")}>Approve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}