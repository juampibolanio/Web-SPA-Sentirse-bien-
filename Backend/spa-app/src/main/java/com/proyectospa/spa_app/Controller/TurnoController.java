package com.proyectospa.spa_app.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyectospa.spa_app.dto.TurnoRequestDTO;
import com.proyectospa.spa_app.model.Turno;
import com.proyectospa.spa_app.service.TurnoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    // Crear un turno
    @PostMapping
    public ResponseEntity<Turno> crearTurnoConCliente(@RequestBody TurnoRequestDTO dto) {
        Turno turno = turnoService.crearTurnoConCliente(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(turno);
    }

    // Obtener todos los turnos
    @GetMapping
    public ResponseEntity<List<Turno>> obtenerTurnos() {
        List<Turno> turnos = turnoService.obtenerTurnos();
        return ResponseEntity.ok(turnos);
    }
}
