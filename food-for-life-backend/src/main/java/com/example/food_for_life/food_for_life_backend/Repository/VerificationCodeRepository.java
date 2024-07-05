package com.example.food_for_life.food_for_life_backend.Repository;

import com.example.food_for_life.food_for_life_backend.Model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByCodeAndUsuarioEmail(String code, String email);
}
