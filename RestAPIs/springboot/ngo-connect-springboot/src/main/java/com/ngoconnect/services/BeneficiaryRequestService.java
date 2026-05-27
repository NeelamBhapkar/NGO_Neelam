package com.ngoconnect.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ngoconnect.entities.BeneficiaryRequest;
import com.ngoconnect.entities.Item;
import com.ngoconnect.entities.User;
import com.ngoconnect.repositories.BeneficiaryRequestRepository;
import com.ngoconnect.repositories.ItemRepository;
import com.ngoconnect.repositories.UserRepository;

@Service
public class BeneficiaryRequestService {

    @Autowired
    private BeneficiaryRequestRepository requestRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ItemRepository itemRepo;

    
    public BeneficiaryRequest createRequest(
            int beneficiaryId,
            int itemId,
            BigDecimal amountNeeded,
            String description,
            String expiryDate,
            MultipartFile proof
    ) {
    	LocalDate expiry;
        try {
            expiry = LocalDate.parse(expiryDate);
        } catch (Exception e) {
            throw new RuntimeException("Invalid expiry date format");
        }

        if (!expiry.isAfter(LocalDate.now())) {
            throw new RuntimeException(
                "Expiry date must be a future date"
            );
        }


        // 🔹 1. SINGLE ACTIVE REQUEST CHECK
        List<BeneficiaryRequest> existingRequests =
                requestRepo.findByBeneficiary_UserId(beneficiaryId);

        boolean hasActiveRequest = existingRequests.stream().anyMatch(req -> {
            String status = req.getRequestStatus();
            return status != null && (
                    status.equalsIgnoreCase("OPEN") ||
                    status.equalsIgnoreCase("PENDING") ||
                    status.equalsIgnoreCase("ACTIVE")
            );
        });

        if (hasActiveRequest) {
            throw new RuntimeException(
                "You already have an active request. Please wait until it is completed or rejected."
            );
        }

        // 🔹 2. FETCH BENEFICIARY & ITEM
        User beneficiary = userRepo.findById(beneficiaryId)
                .orElseThrow(() -> new RuntimeException("Beneficiary not found"));

        Item item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // 🔹 3. PROOF VALIDATION
        if (proof == null || proof.isEmpty()) {
            throw new RuntimeException("Proof document is required");
        }

        // 🔹 4. FILE UPLOAD
        String fileName;
        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            fileName = System.currentTimeMillis() + "_" +
                    (proof.getOriginalFilename() != null ? proof.getOriginalFilename() : "proof");
            Files.copy(proof.getInputStream(), uploadDir.resolve(fileName));
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload proof document: " + e.getMessage());
        }

        // 🔹 5. CREATE REQUEST
        BeneficiaryRequest req = new BeneficiaryRequest();
        req.setBeneficiary(beneficiary);
        req.setItem(item);
        req.setDescription(description);
        req.setRequestStatus("PENDING"); // important
        req.setRequestDate(LocalDate.now());
        req.setExpiryDate(expiry);
        req.setProofDocument(fileName);

        // 🔹 6. AMOUNT VALIDATION
        if (item.getItemName() != null &&
            item.getItemName().equalsIgnoreCase("Financial Assistance")) {

            if (amountNeeded == null || amountNeeded.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException(
                    "Amount must be greater than 0 for financial assistance"
                );
            }
            req.setAmountNeeded(amountNeeded);
        } else {
            req.setAmountNeeded(null);
        }

        return requestRepo.save(req);
    }


    public List<BeneficiaryRequest> getMyRequests(int beneficiaryId) {
        return requestRepo.findByBeneficiary_UserId(beneficiaryId);
    }

    public BeneficiaryRequest updateRequest(
            int requestId,
            BigDecimal amountNeeded,
            String description,
            MultipartFile proof
    ) {
        BeneficiaryRequest req = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String status = req.getRequestStatus() == null ? "" : req.getRequestStatus();
        if (!(status.equalsIgnoreCase("ACTIVE") || status.equalsIgnoreCase("PENDING") || status.equalsIgnoreCase("OPEN"))) {
            throw new RuntimeException("Only ACTIVE or PENDING requests can be edited");
        }

        req.setDescription(description);

        Item item = req.getItem();
        if (item != null && item.getItemName() != null && item.getItemName().equalsIgnoreCase("Financial Assistance")) {
            if (amountNeeded == null || amountNeeded.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be greater than 0 for financial assistance");
            }
            req.setAmountNeeded(amountNeeded);
        } else {
            req.setAmountNeeded(null);
        }

        if (proof != null && !proof.isEmpty()) {
            try {
                Path uploadDir = Paths.get("uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
                String fileName = System.currentTimeMillis() + "_" + (proof.getOriginalFilename() != null ? proof.getOriginalFilename() : "proof");
                Files.copy(proof.getInputStream(), uploadDir.resolve(fileName));
                req.setProofDocument(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload proof document: " + e.getMessage());
            }
        }

        return requestRepo.save(req);
    }

    public void deleteRequest(int id) {
        requestRepo.deleteById(id);
    }
}
