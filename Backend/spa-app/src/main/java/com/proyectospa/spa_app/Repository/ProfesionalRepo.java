package com.proyectospa.spa_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.Model.Profesional;

@Repository
public interface ProfesionalRepo extends JpaRepository <Profesional, Long>  {
    
}