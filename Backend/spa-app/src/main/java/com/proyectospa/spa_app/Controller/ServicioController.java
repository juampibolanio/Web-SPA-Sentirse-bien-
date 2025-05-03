package com.proyectospa.spa_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectospa.spa_app.model.Servicio;
import com.proyectospa.spa_app.service.ServicioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioService servicioService;

    // Obtener todos los servicios disponibles
    @GetMapping
    public ResponseEntity<List<Servicio>> obtenerServicios() {
        List<Servicio> servicios = servicioService.obtenerTodosLosServicios();
        return ResponseEntity.ok(servicios);
    }
}
