package com.proyectospa.spa_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.model.Servicio;
import com.proyectospa.spa_app.repository.ServicioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioService {

    private final ServicioRepository servicioRepository;

    public List<Servicio> obtenerTodosLosServicios() {
        return servicioRepository.findAll();
    }
}
