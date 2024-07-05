package com.example.food_for_life.food_for_life_backend.Auth;

import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import com.example.food_for_life.food_for_life_backend.Model.VerificationCode;
import com.example.food_for_life.food_for_life_backend.Repository.VerificationCodeRepository;
import com.example.food_for_life.food_for_life_backend.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000/"})
public class AuthController {

    @Autowired
    private final AuthService authService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @PostMapping(value = "login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Autenticar usuario y generar token JWT
            Map<String, Object> authResponse = authService.login(request);
            String token = (String) authResponse.get("token");
            Usuario usuario = (Usuario) authResponse.get("usuario");

            // Generar código de verificación
            String verificationCode = UUID.randomUUID().toString().substring(0, 6);

            // Guardar el código de verificación en la base de datos
            VerificationCode code = new VerificationCode(verificationCode, usuario);
            verificationCodeRepository.save(code);

            // Enviar el código de verificación al correo electrónico del usuario
            SimpleMailMessage emailMessage = new SimpleMailMessage();
            emailMessage.setTo(usuario.getEmail());
            emailMessage.setSubject("Código de Verificación");
            emailMessage.setText("Tu código de verificación es: " + verificationCode);
            mailSender.send(emailMessage);

            // Devolver respuesta con el token JWT y mensaje de que se envió el código de verificación
            return ResponseEntity.ok(Map.of("token", token, "message", "Código de verificación enviado a tu correo electrónico"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        Optional<VerificationCode> verificationCodeOpt = verificationCodeRepository.findByCodeAndUsuarioEmail(code, email);
        if (verificationCodeOpt.isPresent() && verificationCodeOpt.get().isValid()) {
            // Código verificado correctamente, eliminar el código de verificación después de ser usado
            verificationCodeRepository.delete(verificationCodeOpt.get());
            return ResponseEntity.ok(Map.of("message", "Código verificado correctamente"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Código de verificación inválido o expirado"));
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
        System.out.println("Correo electrónico del usuario logueado: " + email);
        String userName = authService.getUserName(email);
        Integer idr = authService.getIdr(email);
        System.out.println("Idr del usuario: " + idr);
        Integer userId = authService.getUserId(email); // Obtener el ID del usuario
        System.out.println("Id del usuario: " + userId);
        Map<String, Object> userDetails = new HashMap<>();// Agregar el ID de ,mbl usuario
        userDetails.put("name", userName);
        userDetails.put("idr", idr);
        userDetails.put("id", userId);
        return ResponseEntity.ok(userDetails);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Correo electrónico no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();
        String token = UUID.randomUUID().toString();
        usuarioService.createPasswordResetTokenForUser(usuario, token);

        // Cambia "192.168.x.x" por la IP local de tu computadora
        String resetUrl = "http://192.168.1.17:3000/reset-password?token=" + token;
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(email);
        emailMessage.setSubject("Restablecimiento de contraseña");
        emailMessage.setText("Para restablecer tu contraseña, haz clic en el siguiente enlace: " + resetUrl);

        mailSender.send(emailMessage);

        return ResponseEntity.ok(Map.of("message", "Correo de restablecimiento enviado"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<Usuario> usuarioOpt = usuarioService.validatePasswordResetToken(token);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Token no válido"));
        }

        Usuario usuario = usuarioOpt.get();
        usuarioService.changeUserPassword(usuario, newPassword);
        return ResponseEntity.ok(Map.of("message", "Contraseña restablecida exitosamente"));
    }
}



