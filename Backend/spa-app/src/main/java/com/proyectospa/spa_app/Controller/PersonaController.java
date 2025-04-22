package com.proyectospa.spa_app.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Persona;
import com.proyectospa.spa_app.Service.PersonaServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class PersonaController {
    @Autowired
    PersonaServ personaServ;

    @GetMapping("/persona")
    @ResponseBody
    public List<Persona> listarPersonas() {
        return personaServ.listarPersonas();
    }
    
    @PostMapping("/persona")
    @ResponseBody
    public Persona crearPersona(@RequestBody Persona persona) {
        return personaServ.crearPersona(persona);
    }
    
    @DeleteMapping("/persona/{id}")
    public void eliminarPersona(@PathVariable Long id) {
        personaServ.eliminarPersona(id);
    }

    @GetMapping("/persona/{id}")
    @ResponseBody
    public Persona buscarPersonaPorId(@PathVariable Long id) {
        return personaServ.buscarPersonaPorId(id);
    }
    
    @PutMapping("/persona")
    public Persona editarPersona(@RequestBody Persona persona) {
        return personaServ.editarPersona(persona);
    }

}