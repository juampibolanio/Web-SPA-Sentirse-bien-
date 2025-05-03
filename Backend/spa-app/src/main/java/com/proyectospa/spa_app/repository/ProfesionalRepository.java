package com.proyectospa.spa_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyectospa.spa_app.model.Profesional;

public interface ProfesionalRepository extends JpaRepository<Profesional, Integer> {
    Optional<Profesional> findByUsuario(String usuario);
}
