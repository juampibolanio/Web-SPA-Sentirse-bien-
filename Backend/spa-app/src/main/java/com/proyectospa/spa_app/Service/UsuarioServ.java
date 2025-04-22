/*package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectospa.spa_app.Model.Usuario;
import com.proyectospa.spa_app.Repository.UsuarioRepo;

@Service
public class UsuarioServ {
    @Autowired
    UsuarioRepo usuarioRepo;

    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepo.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepo.findAll();
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepo.findById(id).orElse(null);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepo.deleteById(id);
    }

    public Usuario editarUsuario(Usuario usuario) {
        return usuarioRepo.save(usuario);
    }
}
*/