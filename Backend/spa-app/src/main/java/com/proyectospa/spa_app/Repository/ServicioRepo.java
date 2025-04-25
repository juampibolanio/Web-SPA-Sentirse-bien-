package com.proyectospa.spa_app.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.Model.Servicio;

@Repository
public interface ServicioRepo extends JpaRepository<Servicio, Long>{

    Optional<Servicio> findByNombreContainingIgnoreCase(String nombre);

    List<Servicio> findAllByIdIn(List<Long> ids);



}
