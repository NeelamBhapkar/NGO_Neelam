package com.cdac.ngo_backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.cdac.ngo_backend.entity.BeneficiaryRequest;

@Repository
public interface BeneficiaryRequestRepository extends JpaRepository<BeneficiaryRequest, Long> {
    
    List<BeneficiaryRequest> findByRequestStatus(String requestStatus);

    // Used for Dashboard Stats
    long countByRequestStatus(String requestStatus);
    
    List<BeneficiaryRequest> findByBeneficiaryId(Long beneficiaryId);
}