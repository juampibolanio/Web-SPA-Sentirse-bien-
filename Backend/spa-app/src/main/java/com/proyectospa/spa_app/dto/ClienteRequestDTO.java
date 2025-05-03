package com.proyectospa.spa_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ClienteRequestDTO {
    private String nombre;
    private String dni;
    private String direccion;
    private String telefono;
}

