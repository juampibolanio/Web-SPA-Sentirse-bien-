import React from "react";
import styles from "../styles/AdminDashboard.module.css";

const AdminDashboard = () => {
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
            <li>Perfil</li>
            <li>Gestión de Stock</li>
            <li>Descuentos</li>
            <li>Reportes</li>
            <li>Configuración</li>
          </ul>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <h1>Bienvenida, Carla (Admin)</h1>
          <button className={styles.btnSalir}>Cerrar sesión</button>
        </header>

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
      </div>
    </div>
  );
};

export default AdminDashboard;
