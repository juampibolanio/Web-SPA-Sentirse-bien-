package com.proyectospa.spa_app.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.dto.ClienteRequestDTO;  // Importa el DTO
import com.proyectospa.spa_app.model.Cliente;
import com.proyectospa.spa_app.service.ClienteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    // Crear un cliente
    @PostMapping
    public ResponseEntity<ClienteRequestDTO> crearCliente(@RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteService.guardarCliente(cliente);

        // Convertir el Cliente a ClienteDTO
        ClienteRequestDTO clienteDTO = new ClienteRequestDTO(
            nuevoCliente.getNombre(),
            nuevoCliente.getDni(),
            nuevoCliente.getDireccion(),
            nuevoCliente.getTelefono()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(clienteDTO);
    }

    // Obtener un cliente por su ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteRequestDTO> obtenerCliente(@PathVariable Integer id) {
        Cliente cliente = clienteService.obtenerClientePorId(id);

        // Convertir el Cliente a ClienteDTO
        ClienteRequestDTO clienteDTO = new ClienteRequestDTO(
            cliente.getNombre(),
            cliente.getDni(),
            cliente.getDireccion(),
            cliente.getTelefono()
        );

        return ResponseEntity.ok(clienteDTO);
    }


    @GetMapping
    public ResponseEntity<List<ClienteRequestDTO>> obtenerClientes() {
        List<Cliente> clientes = clienteService.obtenerTodosLosClientes();
        List<ClienteRequestDTO> clienteDTOs = clientes.stream()
            .map(cliente -> new ClienteRequestDTO(
                cliente.getNombre(),
                cliente.getDni(),
                cliente.getDireccion(),
                cliente.getTelefono()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(clienteDTOs);
    }
}
