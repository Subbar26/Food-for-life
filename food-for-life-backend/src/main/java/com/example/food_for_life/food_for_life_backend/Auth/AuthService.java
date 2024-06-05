package com.example.food_for_life.food_for_life_backend.Auth;

import com.example.food_for_life.food_for_life_backend.Repository.UsuarioRepository;
import com.example.food_for_life.food_for_life_backend.Jwt.JwtService;
import com.example.food_for_life.food_for_life_backend.Model.Role;
import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("El correo electrónico no está registrado"));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("La contraseña es incorrecta");
        }

        UserDetails userDetails = usuarioRepository.findByEmail(request.getEmail()).orElse(null);
        String token = jwtService.getToken(userDetails);
        return AuthResponse.builder().token(token).build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .sexo(request.getSexo())
                .pesoActual(request.getPeso_actual())
                .altura(request.getAltura())
                .fechanacimiento(new Date(((java.util.Date) request.getFecha_nacimiento()).getTime()))
                .nivelactividad(request.getNivel_actividad())
                .dietaobjetivo(request.getDieta_objetivo())
                .pesometa(request.getPeso_meta())
                .nombreusuario(request.getNombre_usuario())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        usuarioRepository.save(usuario);

        return AuthResponse.builder().token(jwtService.getToken(usuario)).build();
    }
}
