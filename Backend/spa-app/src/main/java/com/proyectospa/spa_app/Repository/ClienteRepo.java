package com.proyectospa.spa_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.Model.Cliente;
import com.proyectospa.spa_app.Model.Persona;

@Repository
public interface ClienteRepo extends JpaRepository <Cliente, Long>{

    Optional<Cliente> findByPersona(Persona persona);

}