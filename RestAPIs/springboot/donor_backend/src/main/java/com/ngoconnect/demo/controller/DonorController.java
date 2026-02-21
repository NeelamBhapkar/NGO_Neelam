package com.ngoconnect.demo.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ngoconnect.demo.entity.Donation;
import com.ngoconnect.demo.entity.Users;
import com.ngoconnect.demo.services.DonorService;

@RestController
@RequestMapping("/donor")
//@CrossOrigin(origins = "http://localhost:5173") // Your React Port
public class DonorController {

    @Autowired
    private DonorService donorService;

    // 1. Get List of NGOs for Dropdown
    @GetMapping("/ngos")
    public ResponseEntity<List<Users>> getNgoList() {
        return ResponseEntity.ok(donorService.getAllNgos());
    }

    // 2. Get Donation History
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Donation>> getHistory(@PathVariable int userId) {
        return ResponseEntity.ok(donorService.getDonationHistory(userId));
    }

    // 3. Make Donation
    @PostMapping("/donate/{ngoId}")
    public ResponseEntity<Donation> makeDonation(@RequestBody Donation donation, @PathVariable int ngoId) {
        try {
            Donation saved = donorService.donateToNgo(donation, ngoId);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}