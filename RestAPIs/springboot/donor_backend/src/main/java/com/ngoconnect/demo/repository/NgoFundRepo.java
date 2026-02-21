package com.ngoconnect.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ngoconnect.demo.entity.NgoFund;

@Repository
public interface NgoFundRepo extends JpaRepository<NgoFund, Integer> {
    
}