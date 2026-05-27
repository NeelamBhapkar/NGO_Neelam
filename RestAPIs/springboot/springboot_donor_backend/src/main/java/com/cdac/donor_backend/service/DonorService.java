package com.cdac.donor_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Important for atomic updates

import com.cdac.donor_backend.dto.DonationForm;
import com.cdac.donor_backend.model.*;
import com.cdac.donor_backend.repository.*;

@Service
public class DonorService {

    @Autowired
    private BeneficiaryRequestRepository requestRepo;

    @Autowired
    private DonationRepository donationRepo;
    
    @Autowired
    private UserRepository userRepo; // You might need to create this simple Repo
    
    @Autowired
    private ItemRepository itemRepo; // You might need to create this simple Repo

    // Existing methods...
    public List<BeneficiaryRequest> getApprovedRequests() {
        return requestRepo.findAllApprovedRequests();
    }

    public BigDecimal getTotalDonatedAmount(int userId) {
        BigDecimal total = donationRepo.getTotalDonatedAmount(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    // --- NEW METHOD: PROCESS DONATION ---
    @Transactional // Ensures both Save & Update happen, or neither does
    public void processDonation(DonationForm form) {
        // 1. Fetch Entities
        User donor = userRepo.findById(form.getUserId()).orElseThrow(() -> new RuntimeException("Donor not found"));
        Item item = itemRepo.findById(form.getItemId()).orElseThrow(() -> new RuntimeException("Item not found"));
        BeneficiaryRequest request = requestRepo.findById(form.getRequestId()).orElseThrow(() -> new RuntimeException("Request not found"));

        // 2. Create & Save Donation
        Donation donation = new Donation();
        donation.setUser(donor);
        donation.setItem(item);
        donation.setAmount(form.getAmount());
        donation.setDescription(form.getDescription());
        donation.setDonation_date(LocalDateTime.now()); // Set current date
        
        donationRepo.save(donation);

        // 3. Update Beneficiary Request Status
        request.setRequest_status("Completed"); 
        // Note: We DO NOT delete it, just update status.
        
        // 4. Update the received amount in the request (Optional but good)
        request.setReceivedAmount(request.getReceivedAmount() + form.getAmount().doubleValue());
        
        requestRepo.save(request);
    }
    public long getDonationCount(int userId) {
        return donationRepo.countDonationsByUserId(userId);
    }
}