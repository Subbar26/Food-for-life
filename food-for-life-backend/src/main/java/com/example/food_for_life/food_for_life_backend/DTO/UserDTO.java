package com.example.food_for_life.food_for_life_backend.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    Integer id;
    String sexo;
    Float peso_actual;
    Float altura;
    Date fecha_nacimiento;
    String nivel_actividad;
    String dieta_objetivo;
    Float peso_meta;
    String nombre_usuario;
}
