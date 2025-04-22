package com.proyectospa.spa_app.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Turno;
import com.proyectospa.spa_app.Service.TurnoServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class TurnoController {
    @Autowired
    TurnoServ turnoServ;

    //listar los turnos
    @GetMapping("/turnos")
    public List <Turno> listarTurnos() {
        return turnoServ.listarTurnos();
    }

    //crear nuevo turno
    @PostMapping("/turnos")
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoServ.crearTurno(turno);
    }

    //eliminar un turno
    @DeleteMapping("/turnos/{id}")
    public void eliminarTurno(@PathVariable Long id) {
        turnoServ.eliminarTurno(id);
    }
    
    //buscar turno por id
    @GetMapping("/turnos/{id}")
    public Turno buscarTurnoPorId(@PathVariable Long id) {
        return turnoServ.buscarTurnoPorId(id);
    }

    //editar un turno
    @PutMapping("/turnos")
    public Turno editarTurno(@RequestBody Turno turno) {
        return turnoServ.editarTurno(turno);
    }
}