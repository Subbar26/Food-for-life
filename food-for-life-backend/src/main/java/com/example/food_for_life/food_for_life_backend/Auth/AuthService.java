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
import java.util.Calendar;

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

        java.util.Date utilFechaNacimiento = request.getFecha_nacimiento();
        java.sql.Date sqlFechaNacimiento = new java.sql.Date(utilFechaNacimiento.getTime());

        Integer idr = calcularIdr(request);

        Usuario usuario = Usuario.builder()
                .sexo(request.getSexo())
                .pesoActual(request.getPeso_actual())
                .altura(request.getAltura())
                .fechanacimiento(sqlFechaNacimiento)
                .nivelactividad(request.getNivel_actividad())
                .dietaobjetivo(request.getDieta_objetivo())
                .pesometa(request.getPeso_meta())
                .nombreusuario(request.getNombre_usuario())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .idr(idr)
                .build();

        usuarioRepository.save(usuario);

        return AuthResponse.builder().token(jwtService.getToken(usuario)).build();
    }

    private Integer calcularIdr(RegisterRequest request) {
        // Calcula el TMB (Tasa Metabólica Basal)
        float tmb;
        if ("masculino".equalsIgnoreCase(request.getSexo())) {
            tmb = (float) (10 * request.getPeso_actual() + 6.25 * request.getAltura() - 5 * getEdad(new java.sql.Date(request.getFecha_nacimiento().getTime())) + 5);
        } else {
            tmb = (float) (10 * request.getPeso_actual() + 6.25 * request.getAltura() - 5 * getEdad(new java.sql.Date(request.getFecha_nacimiento().getTime())) - 161);
        }

        // Factor de actividad
        float factorActividad = switch (request.getNivel_actividad().toLowerCase()) {
            case "sedentario" -> 1.2f;
            case "baja actividad" -> 1.375f;
            case "activo" -> 1.725f;
            case "muy activo" -> 1.9f;
            default -> throw new IllegalArgumentException("Nivel de actividad no válido");
        };

        // Calcula el IDR
        return Math.round(tmb * factorActividad);
    }

    private int getEdad(Date fechaNacimiento) {
        // Obtener la fecha actual
        Calendar fechaActual = Calendar.getInstance();

        // Crear un calendario con la fecha de nacimiento
        Calendar fechaNac = Calendar.getInstance();
        fechaNac.setTime(fechaNacimiento);

        // Calcular la diferencia en años
        int edad = fechaActual.get(Calendar.YEAR) - fechaNac.get(Calendar.YEAR);

        // Verificar si aún no ha cumplido años este año
        if (fechaActual.get(Calendar.MONTH) < fechaNac.get(Calendar.MONTH) ||
                (fechaActual.get(Calendar.MONTH) == fechaNac.get(Calendar.MONTH) &&
                        fechaActual.get(Calendar.DAY_OF_MONTH) < fechaNac.get(Calendar.DAY_OF_MONTH))) {
            edad--;
        }

        return edad;
    }

    public Integer getIdr(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario no existe"));
        return usuario.getIdr();
    }

    public String getUserName(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return usuario.getNombreusuario();
    }
}
