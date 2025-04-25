package com.proyectospa.spa_app.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.Model.Cliente;
import com.proyectospa.spa_app.Model.Persona;
import com.proyectospa.spa_app.Model.Servicio;
import com.proyectospa.spa_app.Model.Turno;
import com.proyectospa.spa_app.Repository.ClienteRepo;
import com.proyectospa.spa_app.Repository.PersonaRepo;
import com.proyectospa.spa_app.Repository.ServicioRepo;
import com.proyectospa.spa_app.Repository.TurnoRepo;

import jakarta.transaction.Transactional;

@Service
public class TurnoServ {
    @Autowired
    private TurnoRepo turnoRepo;

    @Autowired
    private PersonaRepo personaRepo;

    @Autowired
    private ClienteRepo clienteRepo;

    @Autowired
    private ServicioRepo servicioRepo;

    public Turno crearTurno(Turno turno) {
        return turnoRepo.save(turno);
    }

    public List<Turno> listarTurnos() {
        return turnoRepo.findAll();
    }

    public Turno buscarTurnoPorId(Long id) {
        return turnoRepo.findById(id).orElse(null);
    }

    public void eliminarTurno(Long id) {
        turnoRepo.deleteById(id);
    }

    public Turno editarTurno(Turno turno) {
        return turnoRepo.save(turno);
    }

    @Transactional
    public Turno crearTurno(String dni, String localidad, String direccion, LocalDate fecha, LocalTime horaInicio,
            LocalTime horaFin, List<String> servicios) {
        // Paso 1: Crear una nueva persona
        Persona persona = new Persona();
        persona.setDni(dni);
        persona.setLocalidad(localidad);
        persona.setDireccion(direccion);
        persona.setFecha_nac(null); // Si no tienes fecha de nacimiento, puedes ponerla como null
        personaRepo.save(persona);

        // Paso 2: Crear el cliente y asociarlo con la persona
        Cliente cliente = new Cliente();
        cliente.setPersona(persona);
        cliente.setNumSesiones(0); // Asegúrate de definir cómo gestionas este campo
        clienteRepo.save(cliente);

        // Paso 3: Convertir la lista de Integer a Long
        List<Long> serviciosLong = servicios.stream()
                .map(id -> Long.valueOf(id)) // Convertir cada Integer a Long
                .collect(Collectors.toList());

        // Llamar al repositorio con la lista de Long
        List<Servicio> serviciosSeleccionados = servicioRepo.findAllByIdIn(serviciosLong);

        // Paso 4: Crear el turno
        Turno turno = new Turno();
        turno.setFecha(fecha);
        turno.setHora_inicio(horaInicio);
        turno.setHora_fin(horaFin);
        turno.setCliente(cliente);
        turno.setServicio(serviciosSeleccionados.get(0)); // Asignamos el primer servicio como ejemplo

        // Paso 5: Guardar el turno
        return turnoRepo.save(turno);
    }

}
