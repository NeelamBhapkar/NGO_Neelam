package com.cdac.ngo_backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cdac.ngo_backend.entity.BeneficiaryRequest;
import com.cdac.ngo_backend.repository.BeneficiaryRequestRepository;

@Service
@Transactional
public class BeneficiaryRequestServiceImpl implements BeneficiaryRequestService {

    @Autowired
    private BeneficiaryRequestRepository requestRepo;

    @Override
    public List<BeneficiaryRequest> getRequestsByStatus(String status) {
        return requestRepo.findByRequestStatus(status);
    }

    @Override
    public String updateRequestStatus(Long requestId, String status) {
        BeneficiaryRequest request = requestRepo.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found with ID: " + requestId));
        
        request.setRequestStatus(status);
        requestRepo.save(request);
        return "Request updated successfully to " + status;
    }

    @Override
    public long getRequestCount(String status) {
        return requestRepo.countByRequestStatus(status);
    }
}