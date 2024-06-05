package com.example.food_for_life.food_for_life_backend.Repository;

import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Integer> {
    Optional<Usuario> findByEmail(String email);

}
