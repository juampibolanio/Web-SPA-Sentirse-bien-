package com.proyectospa.spa_app.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import com.proyectospa.spa_app.Model.Cliente;
import com.proyectospa.spa_app.Service.ClienteServ;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class ClienteController {

    @Autowired
    ClienteServ clienteServ;

    //Listar clientes
    @GetMapping("/cliente")
    @ResponseBody
    public List<Cliente> listarClientes() {
        return clienteServ.listarClientes();
    }
    
    //Crear nuevo cliente
    @PostMapping("/cliente")
    @ResponseBody
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteServ.crearCliente(cliente);
    }

    //Eliminar cliente
    @DeleteMapping("cliente/{id}")
    public void eliminarCliente(@PathVariable Long id) {
        clienteServ.eliminarCliente(id);
    }

    //Buscar cliente por id
    @GetMapping("cliente/{id}")
    @ResponseBody
    public Cliente buscarClientePorId(@PathVariable Long id) {
        return clienteServ.buscarClientePorId(id);
    }
    
    //Editar cliente
    @PutMapping("/cliente")
    public void editarCliente(@RequestBody Cliente cliente) {
        clienteServ.editarCliente(cliente);
    }
}