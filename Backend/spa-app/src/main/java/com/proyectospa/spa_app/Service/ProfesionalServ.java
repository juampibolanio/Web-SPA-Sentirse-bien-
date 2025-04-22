package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.Model.Profesional;
import com.proyectospa.spa_app.Repository.ProfesionalRepo;

@Service
public class ProfesionalServ {
    @Autowired
    ProfesionalRepo profesionalRepo;

    public Profesional crearProfesional(Profesional profesional) {
        return profesionalRepo.save(profesional);
    }

    public List<Profesional> listarProfesionales() {
        return profesionalRepo.findAll();
    }

    public Profesional buscarProfesionalPorId(Long id) {
        return profesionalRepo.findById(id).orElse(null);
    }

    public void eliminarProfesional(Long id) {
        profesionalRepo.deleteById(id);
    }

    public Profesional editarProfesional(Profesional profesional) {
        return profesionalRepo.save(profesional);
    }

}
