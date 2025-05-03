package com.proyectospa.spa_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.model.Servicio;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
}
