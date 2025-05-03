package com.proyectospa.spa_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginRequestDTO {
    private String usuario;   
    private String password;  
}
