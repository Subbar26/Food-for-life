package com.example.food_for_life.food_for_life_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlimentoDTO {
    private String nombre;
    private Float grasas;
    private Float carbohidratos;
    private Float proteinas;
    private Float calorias;
}
