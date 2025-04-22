package com.proyectospa.spa_app.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Servicio;
import com.proyectospa.spa_app.Service.ServicioServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ServicioController {
    @Autowired
    ServicioServ servicioServ;

    //listar los servicios
    @GetMapping("/servicio")
    public List<Servicio> listarServicios() {
        return servicioServ.listarServicios();
    }

    //crear nuevo servicio
    @PostMapping("/servicio")
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioServ.crearServicio(servicio);
    }

    //eliminar un servicio
    @DeleteMapping("/servicio/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioServ.eliminarServicio(id);
    }

    //buscar servicio por id
    @GetMapping("/servicio/{id}")
    public Servicio buscarServicioPorId(@PathVariable Long id) {
        return servicioServ.buscarServicioPorId(id);
    }

    //editar un servicio
    @PutMapping("/servicio")
    public Servicio editarServicio(@RequestBody Servicio servicio) {
        return servicioServ.editarServicio(servicio);
    }
    
    //contar turnos por servicio
    @GetMapping("/servicio/{id}/turnos/count")
    public int contarTurnosPorServicio(@PathVariable Long id) {
        return servicioServ.contarTurnosPorServicio(id);
    }
    
}
