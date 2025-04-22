package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyectospa.spa_app.Model.Servicio;
import com.proyectospa.spa_app.Repository.ServicioRepo;
import com.proyectospa.spa_app.Repository.TurnoRepo;

@Service
public class ServicioServ {
    @Autowired
    ServicioRepo servicioRepo;
    TurnoRepo turnoRepo;

    public Servicio crearServicio(Servicio servicio) {
        return servicioRepo.save(servicio);
    }

    public List<Servicio> listarServicios() {
        return servicioRepo.findAll();
    }

    public Servicio buscarServicioPorId(Long id) {
        return servicioRepo.findById(id).orElse(null);
    }

    public void eliminarServicio(Long id) {
        servicioRepo.deleteById(id);
    }

    public Servicio editarServicio(Servicio servicio) {
        return servicioRepo.save(servicio);
    }

    //obtener cantidad de turnos por servicio
    public int contarTurnosPorServicio(Long servicioId) {
        return turnoRepo.countByServicioId(servicioId);
    }
}
