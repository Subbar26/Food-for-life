package com.example.food_for_life.food_for_life_backend.Service;

import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import com.example.food_for_life.food_for_life_backend.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public Usuario crearUsuario(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    public void borrarUsuario(Integer id){
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> listarUsuario(){
        return usuarioRepository.findAll();
    }

    public Usuario buscarUsuarioPorId(Integer id){
        return usuarioRepository.findById(id).orElse(null);
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
