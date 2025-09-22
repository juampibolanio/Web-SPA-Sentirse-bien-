import React, { useState } from "react";
import styles from "../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
  const [seccion, setSeccion] = useState("perfil"); 

  const descuentos = [
    { id: 1, nombre: "Promo 2x1 en cremas", porcentaje: 50, activo: true },
    { id: 2, nombre: "20% en aceites corporales", porcentaje: 20, activo: false },
    { id: 3, nombre: "15% en labiales", porcentaje: 15, activo: true },
  ];

  const productos = [
    { id: 1, nombre: "Crema Facial", stock: 120, precio: 2500 },
    { id: 2, nombre: "Aceite Corporal", stock: 80, precio: 3500 },
    { id: 3, nombre: "Bálsamo Labial", stock: 200, precio: 1200 },
  ];

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Admin</h2>
        <nav>
          <ul>
            <li onClick={() => setSeccion("perfil")}>Perfil</li>
            <li onClick={() => setSeccion("stock")}>Gestión de Stock</li>
            <li onClick={() => setSeccion("descuentos")}>Descuentos</li>
            <li onClick={() => setSeccion("reportes")}>Reportes</li>
            <li onClick={() => setSeccion("config")}>Configuración</li>
          </ul>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h1>Bienvenida, Carla (Admin)</h1>
          <button className={styles.btnSalir}>Cerrar sesión</button>
        </header>

        {seccion === "perfil" && (
          <section className={styles.section}>
            <h2>Perfil</h2>
            <p>Información del admin y opciones de edición de perfil.</p>
          </section>
        )}

        {seccion === "stock" && (
          <section className={styles.section}>
            <h2>Productos en Stock</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.stock}</td>
                    <td>${p.precio}</td>
                    <td>
                      <button className={styles.btnEditar}>Editar</button>
                      <button className={styles.btnEliminar}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {seccion === "descuentos" && (
          <section className={styles.section}>
            <h2>Descuentos Activos</h2>
            <ul className={styles.descuentosList}>
              {descuentos.map((d) => (
                <li key={d.id} className={d.activo ? styles.activo : styles.inactivo}>
                  <span>{d.nombre} - {d.porcentaje}%</span>
                  <button className={styles.btnEditar}>Editar</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {seccion === "reportes" && (
          <section className={styles.section}>
            <h2>Reportes</h2>
            <p>Aquí se mostrarían gráficos y reportes de ventas, stock, descuentos, etc.</p>
          </section>
        )}

        {seccion === "config" && (
          <section className={styles.section}>
            <h2>Configuración</h2>
            <p>Opciones generales del dashboard, permisos y ajustes del sistema.</p>
          </section>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
