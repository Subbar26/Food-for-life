package com.example.food_for_life.food_for_life_backend.Controller;

import com.example.food_for_life.food_for_life_backend.DTO.AlimentoDTO;
import com.example.food_for_life.food_for_life_backend.Model.Alimento;
import com.example.food_for_life.food_for_life_backend.Model.AlimentoUsuario;
import com.example.food_for_life.food_for_life_backend.Model.AlimentoUsuarioId;
import com.example.food_for_life.food_for_life_backend.Repository.AlimentoRepository;
import com.example.food_for_life.food_for_life_backend.Repository.AlimentoUsuarioRepository;
import com.example.food_for_life.food_for_life_backend.Service.AlimentoService;
import com.example.food_for_life.food_for_life_backend.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RestController
@RequestMapping("/api/v1/alimentos")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AlimentoController {

    @Autowired
    private AlimentoService alimentoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AlimentoRepository alimentoRepository;

    @Autowired
    private AlimentoUsuarioRepository alimentoUsuarioRepository;

    @PostMapping("/agregar")
    public ResponseEntity<?> agregarAlimento(@RequestBody AlimentoDTO alimentoDTO, @RequestParam Integer usuarioId, @RequestParam String tipoComida, @RequestParam String fecha) {
        try {
            Alimento nuevoAlimento = alimentoService.agregarAlimento(alimentoDTO);
            Date fechaSql = Date.valueOf(fecha); // Convertir la fecha a java.sql.Date
            alimentoService.relacionarAlimentoUsuario(nuevoAlimento.getId(), usuarioId, tipoComida, fechaSql);
            return ResponseEntity.ok(nuevoAlimento);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el alimento");
        }
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<?> eliminarAlimentoUsuario(
            @RequestParam Integer usuarioId,
            @RequestParam Integer alimentoId,
            @RequestParam String tipoComida) {
        Optional<AlimentoUsuario> alimentoUsuarioOpt = alimentoUsuarioRepository.findFirstByUsuarioIdAndTipoComidaAndAlimentoId(usuarioId, tipoComida, alimentoId);

        if (alimentoUsuarioOpt.isPresent()) {
            alimentoUsuarioRepository.delete(alimentoUsuarioOpt.get());

            // Verificar si el Alimento ya no está asociado con ningún otro usuario
            boolean alimentoStillExists = alimentoUsuarioRepository.existsByAlimentoId(alimentoId);
            if (!alimentoStillExists) {
                // Eliminar el Alimento si ya no está asociado a ningún usuario
                alimentoRepository.deleteById(alimentoId);
            }
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> obtenerAlimentoUsuario(
            @RequestParam Integer usuarioId,
            @RequestParam String tipoComida,
            @RequestParam(required = false) String nombre) {
        List<AlimentoUsuario> alimentoUsuarioList;
        if (nombre != null && !nombre.isEmpty()) {
            alimentoUsuarioList = alimentoUsuarioRepository.findAlimentoUsuarioByUsuarioIdAndTipoComidaAndAlimentoNombre(usuarioId, tipoComida, nombre);
        } else {
            alimentoUsuarioList = alimentoUsuarioRepository.findByUsuarioIdAndTipoComida(usuarioId, tipoComida);
        }
        if (!alimentoUsuarioList.isEmpty()) {
            return ResponseEntity.ok(alimentoUsuarioList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Alimento>> listarAlimentosPorFecha(
            @RequestParam Integer usuarioId,
            @RequestParam String tipoComida,
            @RequestParam Date fecha) {
        List<AlimentoUsuario> alimentoUsuarioList = alimentoService.listarAlimentosPorFecha(usuarioId, tipoComida, fecha);
        List<Alimento> alimentos = alimentoUsuarioList.stream()
                .map(AlimentoUsuario::getAlimento)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alimentos);
    }
}
