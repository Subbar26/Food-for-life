package com.example.food_for_life.food_for_life_backend.Auth;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    String email;
    String password;

}

