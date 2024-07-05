package com.example.food_for_life.food_for_life_backend.Service;

import com.example.food_for_life.food_for_life_backend.DTO.AlimentoDTO;
import com.example.food_for_life.food_for_life_backend.Model.Alimento;
import com.example.food_for_life.food_for_life_backend.Model.AlimentoUsuario;
import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import com.example.food_for_life.food_for_life_backend.Repository.AlimentoRepository;
import com.example.food_for_life.food_for_life_backend.Repository.AlimentoUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlimentoService {

    @Autowired
    private final AlimentoRepository alimentoRepository;

    @Autowired
    private final AlimentoUsuarioRepository alimentoUsuarioRepository;

    public Alimento agregarAlimento(AlimentoDTO alimentoDTO) {
        Alimento alimento = Alimento.builder()
                .nombre(alimentoDTO.getNombre())
                .grasas(alimentoDTO.getGrasas())
                .carbohidratos(alimentoDTO.getCarbohidratos())
                .proteinas(alimentoDTO.getProteinas())
                .calorias(alimentoDTO.getCalorias())
                .build();

        return alimentoRepository.save(alimento);
    }

    public void relacionarAlimentoUsuario(Integer alimentoId, Integer usuarioId, String tipoComida, Date fecha) {
        AlimentoUsuario alimentoUsuario = AlimentoUsuario.builder()
                .alimento(Alimento.builder().id(alimentoId).build())
                .usuario(Usuario.builder().id(usuarioId).build())
                .tipoComida(tipoComida)
                .fecha(fecha) // Usar la fecha proporcionada
                .build();

        alimentoUsuarioRepository.save(alimentoUsuario);
    }


    public void eliminarRegistrosAntiguos() {
        Date fechaLimite = new Date(System.currentTimeMillis() - 48 * 60 * 60 * 1000); // 48 horas
        alimentoUsuarioRepository.deleteOldEntries(fechaLimite);
    }

    public List<AlimentoUsuario> listarAlimentosPorFecha(Integer usuarioId, String tipoComida, Date fecha) {
        return alimentoUsuarioRepository.findByUsuarioIdAndTipoComidaAndFecha(usuarioId, tipoComida, fecha);
    }
}

