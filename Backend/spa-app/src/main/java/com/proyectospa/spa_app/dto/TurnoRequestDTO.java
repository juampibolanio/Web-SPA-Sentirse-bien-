package com.proyectospa.spa_app.dto;

import lombok.Data;

@Data
public class TurnoRequestDTO {
    private String nombre;
    private String dni;
    private String direccion;
    private String telefono;

    private Integer servicioId;
    private String fecha;       // formato: yyyy-MM-ddTHH:mm
    private String horaInicio;  // formato: yyyy-MM-ddTHH:mm
    private String horaFin;     // formato: yyyy-MM-ddTHH:mm
}
