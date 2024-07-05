package com.example.food_for_life.food_for_life_backend.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@IdClass(AlimentoUsuarioId.class)
public class AlimentoUsuario implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    private Usuario usuario;

    @Id
    @ManyToOne
    @JoinColumn(name = "alimento_id")
    private Alimento alimento;

    @Id
    @Column(name = "tipo_comida")
    private String tipoComida; // DESAYUNO, ALMUERZO, CENA, OTRO

    @Temporal(TemporalType.DATE)
    @Column(name = "fecha", nullable = false)
    private Date fecha;

    // Getters y setters
}
