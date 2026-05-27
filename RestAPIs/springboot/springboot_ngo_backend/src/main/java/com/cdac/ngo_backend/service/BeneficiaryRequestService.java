package com.cdac.ngo_backend.service;

import java.util.List;
import com.cdac.ngo_backend.entity.BeneficiaryRequest;

public interface BeneficiaryRequestService {
    
    List<BeneficiaryRequest> getRequestsByStatus(String status);
    
    String updateRequestStatus(Long requestId, String status);

    // NEW: Method to get the counts
    long getRequestCount(String status);
}