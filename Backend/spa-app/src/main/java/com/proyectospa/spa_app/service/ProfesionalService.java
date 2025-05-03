package com.proyectospa.spa_app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.model.Profesional;
import com.proyectospa.spa_app.repository.ProfesionalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfesionalService {

    private final ProfesionalRepository profesionalRepository;
    private final PasswordEncoder passwordEncoder;

    // Método para crear un profesional con la contraseña codificada
    public Profesional crearProfesional(Profesional profesional) {
        profesional.setPassword(passwordEncoder.encode(profesional.getPassword()));
        return profesionalRepository.save(profesional);
    }

    // Buscar un profesional por su nombre de usuario
    public Optional<Profesional> buscarPorUsuario(String usuario) {
        return profesionalRepository.findByUsuario(usuario);
    }

    // Listar todos los profesionales
    public List<Profesional> listarProfesionales() {
        return profesionalRepository.findAll();
    }

    // Método para autenticar a un profesional con su usuario y contraseña
    public Profesional autenticar(String usuario, String password) {
        // Buscar al profesional por su usuario
        Profesional profesional = profesionalRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

        // Verificar que la contraseña proporcionada coincida con la almacenada (codificada)
        if (!passwordEncoder.matches(password, profesional.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return profesional;
    }
}
