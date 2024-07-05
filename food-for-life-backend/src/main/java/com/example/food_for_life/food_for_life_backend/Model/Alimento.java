package com.example.food_for_life.food_for_life_backend.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Alimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private Float grasas;
    private Float carbohidratos;
    private Float proteinas;
    private Float calorias;

    @OneToMany(mappedBy = "alimento")
    @JsonBackReference
    private List<AlimentoUsuario> alimentosUsuario;

    // Getters y setters
}
