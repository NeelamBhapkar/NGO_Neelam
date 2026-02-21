package com.ngoconnect.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ngoconnect.demo.entity.Donation;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Integer> {

    
    @Query("SELECT d FROM Donation d WHERE d.user_id = :userId ORDER BY d.donation_date DESC")
    List<Donation> findHistoryByUserId(int userId);
}
