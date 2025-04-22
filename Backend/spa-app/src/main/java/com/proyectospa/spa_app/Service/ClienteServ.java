package com.proyectospa.spa_app.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyectospa.spa_app.Model.Cliente;
import com.proyectospa.spa_app.Repository.ClienteRepo;

@Service
public class ClienteServ {
    @Autowired
    ClienteRepo clienteRepo;

    public Cliente crearCliente(Cliente cliente) {
        return clienteRepo.save(cliente);
    }

    public List<Cliente> listarClientes() {
        return clienteRepo.findAll();
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepo.findById(id).orElse(null);
    }

    public void eliminarCliente(Long id) {
        clienteRepo.deleteById(id);
    }

    public Cliente editarCliente(Cliente cliente) {
        return clienteRepo.save(cliente);
    }
}
