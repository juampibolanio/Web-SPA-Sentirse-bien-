package com.proyectospa.spa_app.ConfigCords;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configurar CORS para todas las rutas de la aplicación
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Orígenes permitidos explícitamente
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization", "Content-Type")  // Especificar los encabezados permitidos
                .allowCredentials(true);  // Permitir credenciales
    }
}
