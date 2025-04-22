package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.Model.Persona;
import com.proyectospa.spa_app.Repository.PersonaRepo;

@Service
public class PersonaServ {

    @Autowired
    PersonaRepo personaRepo;

    public Persona crearPersona(Persona persona) {
        return personaRepo.save(persona);
    }

    public List <Persona> listarPersonas() {
        return personaRepo.findAll();
    }

    public Persona buscarPersonaPorId(Long id) {
        return personaRepo.findById(id).orElse(null);
    }

    public void eliminarPersona(Long id) {
        personaRepo.deleteById(id);
    }

    public Persona editarPersona(Persona persona) {
        return personaRepo.save(persona);
    }
}