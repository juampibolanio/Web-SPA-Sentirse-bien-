package com.proyectospa.spa_app.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Profesional;
import com.proyectospa.spa_app.Service.ProfesionalServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ProfesionalController {

    @Autowired
    ProfesionalServ profesionalServ;


    //Listar los profesionales
    @GetMapping("/profesional")
    @ResponseBody
    public List <Profesional> listarProfesionales() {
        return profesionalServ.listarProfesionales();
    }

    //Crear profesional
    @PostMapping("/profesional")
    @ResponseBody
    public Profesional crearProfesional(@RequestBody Profesional profesional) {
        return profesionalServ.crearProfesional(profesional);
    }

    //Eliminar profesional
    @DeleteMapping("/profesional/{id}")
    public void eliminarProfesional(@PathVariable Long id) {
        profesionalServ.eliminarProfesional(id);
    }

    //buscar profesional por id
    @GetMapping("/profesional/{id}")
    @ResponseBody
    public Profesional buscarProfesionalPorId(@PathVariable Long id) {
        return profesionalServ.buscarProfesionalPorId(id);
    }

    //modificar un profesional
    @PutMapping("/profesional")
    public Profesional editarProfesional(@RequestBody Profesional profesional) {
        return profesionalServ.editarProfesional(profesional);
    }
    
    
}
