package com.example.food_for_life.food_for_life_backend.Auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000/"})
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
            authService.register(request); // Realiza el registro en el servicio
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente"); // Mensaje de éxito
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/idr")
    public ResponseEntity<?> getIdrAndUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        System.out.println("Correo electrónico del usuario logueado: " + email); // Agregar esta línea
        String userName = authService.getUserName(email); // Obtener el nombre del usuario
        Integer idr = authService.getIdr(email); // Obtener el IDR del usuario
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("name", userName);
        userDetails.put("idr", idr);
        return ResponseEntity.ok(userDetails);
    }
}
