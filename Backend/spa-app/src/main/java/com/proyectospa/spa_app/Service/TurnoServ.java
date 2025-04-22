package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.Model.Turno;
import com.proyectospa.spa_app.Repository.TurnoRepo;

@Service
public class TurnoServ {
    @Autowired
    TurnoRepo turnoRepo;

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
}
