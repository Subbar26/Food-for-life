package com.example.food_for_life.food_for_life_backend.Auth;

import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    Integer id;
    String sexo;
    Float peso_actual;
    Float altura;
    Date fecha_nacimiento;
    String nivel_actividad;
    String dieta_objetivo;
    Float peso_meta;
    String nombre_usuario;
    String email;
    String password;
}

