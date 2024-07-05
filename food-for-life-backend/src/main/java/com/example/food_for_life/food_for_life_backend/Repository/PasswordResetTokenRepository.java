package com.example.food_for_life.food_for_life_backend.Repository;

import com.example.food_for_life.food_for_life_backend.Model.PasswordResetToken;
import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    PasswordResetToken findByUsuario(Usuario usuario);
}
