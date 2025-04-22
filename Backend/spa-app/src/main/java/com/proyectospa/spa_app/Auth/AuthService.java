package com.proyectospa.spa_app.Auth;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.proyectospa.spa_app.Jwt.jwtService;
import com.proyectospa.spa_app.Model.Role;
import com.proyectospa.spa_app.Model.User;
import com.proyectospa.spa_app.Repository.UsuarioRepo;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepo usuarioRepo;
    private final jwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    //Servicio para el login del usuario
    public AuthResponse login (LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword() ));
        UserDetails user = usuarioRepo.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    //Servicio para el registro de un usuario
    public AuthResponse register (RegisterRequest request) {
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .email(request.getEmail())
            .role(Role.USER)
            .build();

        usuarioRepo.save(user);
        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }
}
