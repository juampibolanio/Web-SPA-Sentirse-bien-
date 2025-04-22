package com.proyectospa.spa_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectospa.spa_app.Model.Turno;

@Repository
public interface TurnoRepo extends JpaRepository<Turno, Long>{
    
    //metodo para contar los turnos de un servicio
    int countByServicioId(Long servicioId);

}
