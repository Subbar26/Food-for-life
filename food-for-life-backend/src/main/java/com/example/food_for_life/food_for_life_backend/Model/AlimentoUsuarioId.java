package com.example.food_for_life.food_for_life_backend.Model;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class AlimentoUsuarioId implements Serializable {
    private Integer usuario;
    private Integer alimento;
    private String tipoComida;
    private Date fecha;

    // Default constructor
    public AlimentoUsuarioId() {}

    // Parameterized constructor
    public AlimentoUsuarioId(Integer usuario, Integer alimento, String tipoComida) {
        this.usuario = usuario;
        this.alimento = alimento;
        this.tipoComida = tipoComida;
    }

    // Getters and Setters
    public Integer getUsuario() {
        return usuario;
    }

    public void setUsuario(Integer usuario) {
        this.usuario = usuario;
    }

    public Integer getAlimento() {
        return alimento;
    }

    public void setAlimento(Integer alimento) {
        this.alimento = alimento;
    }

    public String getTipoComida() {
        return tipoComida;
    }

    public void setTipoComida(String tipoComida) {
        this.tipoComida = tipoComida;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    // Equals and HashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AlimentoUsuarioId that = (AlimentoUsuarioId) o;
        return Objects.equals(usuario, that.usuario) &&
                Objects.equals(alimento, that.alimento) &&
                Objects.equals(tipoComida, that.tipoComida) &&
                Objects.equals(fecha, that.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, alimento, tipoComida, fecha);
    }
}
