package com.proyectospa.spa_app.Dto;

// TurnoRequest.java
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.Data;

@Data
public class TurnoRequest {
    private String dni;
    private String localidad;
    private String direccion;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private List<String> servicios; // nombres de los servicios
}
