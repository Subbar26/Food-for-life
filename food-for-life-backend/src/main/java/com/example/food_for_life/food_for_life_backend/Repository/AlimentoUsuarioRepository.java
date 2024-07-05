package com.example.food_for_life.food_for_life_backend.Repository;

import com.example.food_for_life.food_for_life_backend.Model.AlimentoUsuario;
import com.example.food_for_life.food_for_life_backend.Model.AlimentoUsuarioId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlimentoUsuarioRepository extends JpaRepository<AlimentoUsuario, AlimentoUsuarioId> {
    List<AlimentoUsuario> findByUsuarioId(Integer usuarioId);

    @Query("SELECT au FROM AlimentoUsuario au WHERE au.usuario.id = :usuarioId AND au.tipoComida = :tipoComida AND au.alimento.nombre = :nombre")
    List<AlimentoUsuario> findAlimentoUsuarioByUsuarioIdAndTipoComidaAndAlimentoNombre(@Param("usuarioId") Integer usuarioId, @Param("tipoComida") String tipoComida, @Param("nombre") String nombre);

    @Query("SELECT au FROM AlimentoUsuario au WHERE au.usuario.id = :usuarioId AND au.tipoComida = :tipoComida AND au.alimento.id = :alimentoId")
    Optional<AlimentoUsuario> findFirstByUsuarioIdAndTipoComidaAndAlimentoId(@Param("usuarioId") Integer usuarioId, @Param("tipoComida") String tipoComida, @Param("alimentoId") Integer alimentoId);

    @Query("SELECT au FROM AlimentoUsuario au WHERE au.usuario.id = :usuarioId AND au.tipoComida = :tipoComida")
    List<AlimentoUsuario> findByUsuarioIdAndTipoComida(@Param("usuarioId") Integer usuarioId, @Param("tipoComida") String tipoComida);

    @Query("SELECT au FROM AlimentoUsuario au WHERE au.usuario.id = :usuarioId AND au.tipoComida = :tipoComida AND au.fecha = :fecha")
    List<AlimentoUsuario> findByUsuarioIdAndTipoComidaAndFecha(@Param("usuarioId") Integer usuarioId, @Param("tipoComida") String tipoComida, @Param("fecha") Date fecha);

    @Query("DELETE FROM AlimentoUsuario au WHERE au.fecha < :fechaLimite")
    void deleteOldEntries(@Param("fechaLimite") Date fechaLimite);

    boolean existsByAlimentoId(Integer alimentoId);
}
