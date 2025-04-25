package com.proyectospa.spa_app.Controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;

import com.proyectospa.spa_app.Dto.TurnoRequest;
import com.proyectospa.spa_app.Model.Cliente;
import com.proyectospa.spa_app.Model.Persona;
import com.proyectospa.spa_app.Model.Servicio;
import com.proyectospa.spa_app.Model.Turno;
import com.proyectospa.spa_app.Model.User;
import com.proyectospa.spa_app.Repository.ClienteRepo;
import com.proyectospa.spa_app.Repository.PersonaRepo;
import com.proyectospa.spa_app.Repository.ServicioRepo;
import com.proyectospa.spa_app.Repository.TurnoRepo;
import com.proyectospa.spa_app.Repository.UsuarioRepo;
import com.proyectospa.spa_app.Service.TurnoServ;

import jakarta.transaction.Transactional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class TurnoController {
    @Autowired
    TurnoServ turnoServ;
    PersonaRepo personaRepository;
    ClienteRepo clienteRepository;
    ServicioRepo servicioRepository;
    TurnoRepo turnoRepository;
    UsuarioRepo userRepository;
    TurnoServ turnoService;

    // listar los turnos
    @GetMapping("/turnos")
    public List<Turno> listarTurnos() {
        return turnoServ.listarTurnos();
    }

    // crear nuevo turno
    @PostMapping("/turnos")
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoServ.crearTurno(turno);
    }

    // eliminar un turno
    @DeleteMapping("/turnos/{id}")
    public void eliminarTurno(@PathVariable Long id) {
        turnoServ.eliminarTurno(id);
    }

    // buscar turno por id
    @GetMapping("/turnos/{id}")
    public Turno buscarTurnoPorId(@PathVariable Long id) {
        return turnoServ.buscarTurnoPorId(id);
    }

    // editar un turno
    @PutMapping("/turnos")
    public Turno editarTurno(@RequestBody Turno turno) {
        return turnoServ.editarTurno(turno);
    }

    @PostMapping("/api/turnos/crear")
    public ResponseEntity<Turno> crearTurno(@RequestBody TurnoRequest request) {
        Turno turno = turnoServ.crearTurno(
                request.getDni(),
                request.getLocalidad(),
                request.getDireccion(),
                request.getFecha(),
                request.getHoraInicio(),
                request.getHoraFin(),
                request.getServicios());
        return new ResponseEntity<>(turno, HttpStatus.CREATED);
    }
}
