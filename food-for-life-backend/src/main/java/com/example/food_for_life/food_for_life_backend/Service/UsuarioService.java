package com.example.food_for_life.food_for_life_backend.Service;

import com.example.food_for_life.food_for_life_backend.Auth.RegisterRequest;
import com.example.food_for_life.food_for_life_backend.DTO.UserDTO;
import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import com.example.food_for_life.food_for_life_backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired
    private final UsuarioRepository usuarioRepository;

    public Usuario crearUsuario(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    public void borrarUsuario(Integer id){
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> listarUsuario(){
        return usuarioRepository.findAll();
    }


    public UserDTO buscarUsuarioPorId(Integer id){
        Usuario usuario = usuarioRepository.findById(id).orElse(null);

        if(usuario !=null)
        {
            UserDTO userDTO = UserDTO.builder()
                    .id(usuario.getId())
                    .sexo(usuario.getSexo())
                    .peso_actual(usuario.getPesoActual())
                    .altura(usuario.getAltura())
                    .fecha_nacimiento(usuario.getFechanacimiento())
                    .nivel_actividad(usuario.getNivelactividad())
                    .dieta_objetivo(usuario.getDietaobjetivo())
                    .peso_meta(usuario.getPesometa())
                    .nombre_usuario(usuario.getNombreusuario())
                    .build();
                    return userDTO;
        }
        return null;
    }

    public Usuario modificarUsuario(Integer id, Usuario usuarioModificado){
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            usuarioModificado.setId(id);
            return usuarioRepository.save(usuarioModificado);
        }
        return null;
    }

}
