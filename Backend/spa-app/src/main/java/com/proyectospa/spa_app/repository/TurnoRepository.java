package com.proyectospa.spa_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.model.Turno;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Integer> {
}
