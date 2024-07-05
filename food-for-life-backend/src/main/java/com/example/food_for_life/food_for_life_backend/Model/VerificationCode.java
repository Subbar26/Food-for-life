package com.example.food_for_life.food_for_life_backend.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private LocalDateTime expiryDate;

    public VerificationCode() {
    }

    public VerificationCode(String code, Usuario usuario) {
        this.code = code;
        this.usuario = usuario;
        this.expiryDate = LocalDateTime.now().plusMinutes(3); // Código válido por 10 minutos
    }

    public boolean isValid() {
        return LocalDateTime.now().isBefore(this.expiryDate);
    }

    // Getters y Setters
}
