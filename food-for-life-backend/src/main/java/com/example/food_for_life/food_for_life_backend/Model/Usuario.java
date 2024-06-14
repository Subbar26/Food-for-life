package com.example.food_for_life.food_for_life_backend.Model;

import java.sql.Date;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String sexo;

    @Column(name = "peso_actual")
    private Float pesoActual;

    @Column(name = "altura")
    private Float altura;

    @Column(name = "fecha_nacimiento")
    private Date fechanacimiento;

    @Column(name= "nivel_actividad",length = 255)
    private String nivelactividad;

    @Column(name = "dieta_objetivo", length = 255)
    private String dietaobjetivo;

    @Column(name = "peso_meta")
    private Float pesometa;

    @Column(name="nombre_usuario", length = 255)
    private String nombreusuario;

    @Column(length = 255, nullable = false, unique = true)
    private String email;

    @Column(length = 255, nullable = false, unique = true)
    private String password;

    @Enumerated(EnumType.STRING)
    Role role;

    @Column(name = "idr")
    private Integer idr;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority((role.name())));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
