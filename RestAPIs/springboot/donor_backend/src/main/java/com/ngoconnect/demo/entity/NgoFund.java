package com.ngoconnect.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="ngo_funds") // Matches your table name
public class NgoFund {
    
    @Id
    @Column(name = "ngo_id") // Acts as both PK and FK to Users table
    private int ngo_id;
    
    private Float funds;        // Total funds raised (historical)
    private Float current_fund; // Current available balance
}