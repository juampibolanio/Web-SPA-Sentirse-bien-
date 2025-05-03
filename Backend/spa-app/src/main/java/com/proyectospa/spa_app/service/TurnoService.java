package com.proyectospa.spa_app.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.proyectospa.spa_app.dto.TurnoRequestDTO;
import com.proyectospa.spa_app.model.Cliente;
import com.proyectospa.spa_app.model.Servicio;
import com.proyectospa.spa_app.model.Turno;
import com.proyectospa.spa_app.repository.ClienteRepository;
import com.proyectospa.spa_app.repository.ServicioRepository;
import com.proyectospa.spa_app.repository.TurnoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    // Usamos un formateador de fecha para asegurarnos que el formato sea correcto
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    public Turno crearTurnoConCliente(TurnoRequestDTO dto) {
        // Validación básica
        if (dto.getNombre() == null || dto.getDni() == null || dto.getServicioId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Faltan datos obligatorios");
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setDni(dto.getDni());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        cliente = clienteRepository.save(cliente); // Guardamos el cliente primero

        // Buscamos el servicio por ID, si no existe, lanzamos un error detallado
        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));

        // Creamos el turno
        Turno turno = new Turno();
        turno.setCliente(cliente);
        turno.setServicio(servicio);

        try {
            turno.setFecha(LocalDateTime.parse(dto.getFecha(), FORMATTER));
            turno.setHoraInicio(LocalDateTime.parse(dto.getHoraInicio(), FORMATTER));
            turno.setHoraFin(LocalDateTime.parse(dto.getHoraFin(), FORMATTER));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error de formato de fecha y hora");
        }

        // Guardamos el turno
        return turnoRepository.save(turno);
    }

    public List<Turno> obtenerTurnos() {
        return turnoRepository.findAll();
    }
}
