package com.ngoconnect.demo.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ngoconnect.demo.entity.*;
import com.ngoconnect.demo.repository.*;

@Service
public class DonorService {

    @Autowired
    private DonationRepository donationRepo;

    @Autowired
    private NgoFundRepo ngoFundRepo;

    @Autowired
    private UserRepository userRepo;

    // 1. Get List of NGOs for Dropdown
    public List<Users> getAllNgos() {
        return userRepo.findAllNgos();
    }

    // 2. Get Donor History
    public List<Donation> getDonationHistory(int userId) {
        return donationRepo.findHistoryByUserId(userId);
    }

    // 3. Process Donation (Transactional)
    @Transactional
    public Donation donateToNgo(Donation donation, int targetNgoId) {
        
        // A. Setup Donation Record
        if (donation.getAmount_donated() == null) {
            donation.setAmount_donated(donation.getAmount());
        }
        long millis = System.currentTimeMillis();
        donation.setDonation_date(new java.sql.Date(millis));
        
        // Save the Target NGO ID (using item_id column as placeholder based on schema limits)
        //donation.setTarget_ngo_id(targetNgoId); 
        
        Donation savedDonation = donationRepo.save(donation);

        // B. Update NGO Funds Table
        NgoFund fund = ngoFundRepo.findById(targetNgoId)
            .orElse(new NgoFund(targetNgoId, 0.0f, 0.0f)); // Create record if new

        float amount = donation.getAmount_donated().floatValue();
        
        // Add to existing funds
        fund.setFunds((fund.getFunds() != null ? fund.getFunds() : 0) + amount);
        fund.setCurrent_fund((fund.getCurrent_fund() != null ? fund.getCurrent_fund() : 0) + amount);

        ngoFundRepo.save(fund);

        return savedDonation;
    }
}