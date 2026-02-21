package com.ngoconnect.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users") // Matches your database table name
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId; // CamelCase for Java, mapped to user_id in DB

    private String username;
    private String password;
    
    @Column(name = "role_id")
    private int role_id; // Essential for distinguishing NGOs (Role ID 2) from Donors
    
    @Column(name = "phone_no")
    private String phoneNo;

    private String email;
    
    @Column(name = "pan_no")
    private String panNo;
    
    @Column(name = "account_status")
    private String accountStatus;

    private String address;
    
    @Column(name = "state_id")
    private Integer stateId;
    
    @Column(name = "city_id")
    private Integer cityId;
}
