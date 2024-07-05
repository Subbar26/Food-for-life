package com.example.food_for_life.food_for_life_backend.Repository;

import com.example.food_for_life.food_for_life_backend.Model.Alimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlimentoRepository extends JpaRepository<Alimento, Integer> {
}
