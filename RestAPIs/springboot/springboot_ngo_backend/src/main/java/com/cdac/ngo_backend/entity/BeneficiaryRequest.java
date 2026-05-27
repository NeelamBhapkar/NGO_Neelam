package com.cdac.ngo_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "beneficiary_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BeneficiaryRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "beneficiary_id")
    private Long beneficiaryId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "amount_needed")
    private Double amountNeeded;

    @Column(name = "description")
    private String description;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "request_status")
    private String requestStatus; // e.g., "OPEN", "APPROVED", "REJECTED"

    @Column(name = "proof_document")
    private String proofDocument;

    @Column(name = "received_amount")
    private Double receivedAmount;
}