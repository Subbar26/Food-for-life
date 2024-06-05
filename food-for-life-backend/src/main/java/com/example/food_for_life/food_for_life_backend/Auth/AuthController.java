package com.example.food_for_life.food_for_life_backend.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3001/"})
public class AuthController {

    private final AuthService authService;



    @PostMapping(value = "login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(value = "register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
