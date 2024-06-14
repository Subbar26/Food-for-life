package com.example.food_for_life.food_for_life_backend.Controller;


import com.example.food_for_life.food_for_life_backend.DTO.UserDTO;
import com.example.food_for_life.food_for_life_backend.Model.Usuario;
import com.example.food_for_life.food_for_life_backend.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000/"})
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/demo")
    public String welcome()
    {
        return "Welcome from secure endpoint";
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<Usuario>> listarUsuarios(){
        return ResponseEntity.ok().body(usuarioService.listarUsuario());
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<UserDTO> obtenerUsuarioPorId(@PathVariable Integer id){

        UserDTO  userDTO= usuarioService.buscarUsuarioPorId(id);
        if(userDTO == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(userDTO);
    }

    @PostMapping("/usuario/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario){
        return ResponseEntity.ok().body(usuarioService.crearUsuario(usuario));
    }

    @PutMapping("/usuario/modificar/{id}")
    public ResponseEntity<Usuario> modificarUsuario(@PathVariable(value = "id") Integer id, @RequestBody Usuario usuarioModificado){
        Usuario usuario = usuarioService.modificarUsuario(id, usuarioModificado);
        if(usuario == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(usuario);
    }

    @DeleteMapping("usuario/borrar/{id}")
    public ResponseEntity<?> borrarUsuario(@PathVariable(value = "id") Integer id){
        usuarioService.borrarUsuario(id);
        return ResponseEntity.ok().build();
    }
}
