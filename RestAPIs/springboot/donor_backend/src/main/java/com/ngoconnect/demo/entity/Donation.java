package com.ngoconnect.demo.entity;

import java.sql.Date;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name="donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int donation_id;

    private int user_id;       // The Donor's ID
    
    // In this flow, the 'item_id' might be null or specific for 'Money'
    // 'benef_request_id' is null because this is a direct donation to NGO
    private Integer benef_request_id; 

    @Column(name = "ngo_id_received") // Add this column if you want to track which NGO got it
    private Integer ngo_id_received; // Or reuse a field if your schema is strict
    private int item_id = 1;
    private Date donation_date;
    private String description;
    private Double amount;
    private Double amount_donated; 
}