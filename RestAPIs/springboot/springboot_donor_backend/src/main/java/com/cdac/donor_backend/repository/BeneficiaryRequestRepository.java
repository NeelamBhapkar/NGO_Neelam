package com.cdac.donor_backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.cdac.donor_backend.model.BeneficiaryRequest;

@Repository
public interface BeneficiaryRequestRepository extends JpaRepository<BeneficiaryRequest, Integer> {
    
    // Fetch only requests where status is exactly 'Approved'
    @Query("SELECT r FROM BeneficiaryRequest r WHERE r.request_status = 'Approved'")
    List<BeneficiaryRequest> findAllApprovedRequests();
}