package com.cdac.donor_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "beneficiary_request")
public class BeneficiaryRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int request_id;

    @ManyToOne
    @JoinColumn(name = "beneficiary_id")
    private User beneficiary;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private double amount_needed;
    
    // --- NEW FIELD ADDED HERE ---
    @Column(name = "received_amount") // Maps to your new DB column
    private double receivedAmount; 
    // ----------------------------

    private String description;
    private LocalDate request_date;
    private String request_status;
    private String proof_document;
}