/*package com.proyectospa.spa_app.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Usuario;
import com.proyectospa.spa_app.Service.UsuarioServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class UsuarioController {

    @Autowired
    UsuarioServ usuarioServ;

    @GetMapping("/usuario")
    @ResponseBody
    public List<Usuario> listarUsuarios() {
        return usuarioServ.listarUsuarios();
    }

    @PostMapping("/usuario")
    @ResponseBody
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioServ.crearUsuario(usuario);
    }

    @DeleteMapping("usuario/{id}") 
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioServ.eliminarUsuario(id);
    }

    @GetMapping("/usuario/{id}")
    @ResponseBody
    public Usuario buscarUsuarioPorId(@PathVariable Long id) {
        return usuarioServ.buscarUsuarioPorId(id);
    }

    @PutMapping("/usuario")
    public void editarUsuario(@RequestBody Usuario usuario) {        
        usuarioServ.editarUsuario(usuario);
    }
}*/