package com.proyectospa.spa_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectospa.spa_app.dto.LoginRequestDTO;
import com.proyectospa.spa_app.security.service.JwtService;
import com.proyectospa.spa_app.service.ProfesionalService;
import com.proyectospa.spa_app.model.Profesional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ProfesionalService profesionalService;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequestDTO request) {
        // Intentar autenticar al profesional con el servicio
        Profesional profesional = profesionalService.autenticar(request.getUsuario(), request.getPassword());

        // Si la autenticación es exitosa, generar y devolver el JWT
        return jwtService.generateToken(profesional.getUsuario());
    }
}
