package com.proyectospa.spa_app.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.proyectospa.spa_app.Model.User;

@Repository
public interface UsuarioRepo extends JpaRepository<User, Long>{

    Optional<User> findByUsername(String username);
}
