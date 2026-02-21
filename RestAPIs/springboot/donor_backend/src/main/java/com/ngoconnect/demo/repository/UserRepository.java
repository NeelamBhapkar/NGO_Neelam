package com.ngoconnect.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.ngoconnect.demo.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    
    // Fetch users who have the role of 'NGO' (assuming role_id 2 is NGO)
    @Query("SELECT u FROM Users u WHERE u.role_id = 2") 
    List<Users> findAllNgos();
}