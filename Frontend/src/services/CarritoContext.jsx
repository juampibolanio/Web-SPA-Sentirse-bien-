import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CarritoContext = createContext();

const initialState = { items: [], cargando: true };

const obtenerUsuarioDelToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || payload.id;
  } catch { return null; }
};

const cargarCarritoDesdeStorage = () => {
  try {
    const usuarioId = obtenerUsuarioDelToken();
    const key = usuarioId ? `carrito_${usuarioId}` : 'carrito_anonimo';
    const carritoGuardado = localStorage.getItem(key);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  } catch { return []; }
};

const guardarCarritoEnStorage = (items) => {
  try {
    const usuarioId = obtenerUsuarioDelToken();
    const key = usuarioId ? `carrito_${usuarioId}` : 'carrito_anonimo';
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
};

const migrarCarritoAnonimo = (usuarioId) => {
  try {
    const carritoAnonimo = localStorage.getItem('carrito_anonimo');
    if (carritoAnonimo && usuarioId) {
      localStorage.setItem(`carrito_${usuarioId}`, carritoAnonimo);
      localStorage.removeItem('carrito_anonimo');
      return JSON.parse(carritoAnonimo);
    }
  } catch {}
  return null;
};

const carritoReducer = (state, action) => {
  switch (action.type) {
    case 'CARGAR_CARRITO':
      return { ...state, items: cargarCarritoDesdeStorage(), cargando: false };
    case 'MIGRAR_CARRITO': return { ...state, items: action.payload };
    case 'AGREGAR_ITEM': {
      const existe = state.items.find(i => i.producto.id === action.payload.producto.id);
      const nuevosItems = existe
        ? state.items.map(i => i.producto.id === action.payload.producto.id ? { ...i, cantidad: i.cantidad + action.payload.cantidad } : i)
        : [...state.items, action.payload];
      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }
    case 'ACTUALIZAR_CANTIDAD': {
      const item = state.items.find(i => i.id === action.payload.itemId);
      if (!item || action.payload.cantidad < 1 || action.payload.cantidad > item.producto.stock) return state;
      const nuevosItems = state.items.map(i => i.id === action.payload.itemId ? { ...i, cantidad: action.payload.cantidad } : i);
      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }
    case 'ELIMINAR_ITEM': {
      const nuevosItems = state.items.filter(i => i.id !== action.payload);
      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }
    case 'VACIAR_CARRITO': { 
      guardarCarritoEnStorage([]); 
      return { ...state, items: [] }; 
    }
    case 'SYNC_CARRITO_DB': {
      const itemsDB = action.payload || [];
      const combinados = [...state.items];
      itemsDB.forEach(i => { if (!combinados.find(ci => ci.producto.id === i.producto.id)) combinados.push(i); });
      guardarCarritoEnStorage(combinados);
      return { ...state, items: combinados };
    }
    default: return state;
  }
};

export const CarritoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  const acciones = {
    cargarCarrito: () => dispatch({ type: 'CARGAR_CARRITO' }),
    migrarCarrito: (usuarioId) => { 
      const items = migrarCarritoAnonimo(usuarioId); 
      if (items) dispatch({ type: 'MIGRAR_CARRITO', payload: items }); 
    },
    sincronizarConDB: (itemsDB) => dispatch({ type: 'SYNC_CARRITO_DB', payload: itemsDB }),
    agregarAlCarrito: (producto, cantidad = 1) => {
      if (!producto?.id) return { success: false, error: 'Producto inválido' };
      if (cantidad < 1) return { success: false, error: 'Cantidad debe ser al menos 1' };
      if (cantidad > producto.stock) return { success: false, error: `No hay suficiente stock. Max: ${producto.stock}` };
      const nuevoItem = { id: `${producto.id}_${Date.now()}`, producto: { ...producto, imagen: producto.imagen || producto.imagenUrl }, cantidad, fechaAgregado: new Date().toISOString(), precioUnitario: producto.precio };
      dispatch({ type: 'AGREGAR_ITEM', payload: nuevoItem });
      return { success: true, item: nuevoItem };
    },
    actualizarCantidad: (itemId, cantidad) => { dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { itemId, cantidad } }); return { success: true }; },
    eliminarDelCarrito: (itemId) => { dispatch({ type: 'ELIMINAR_ITEM', payload: itemId }); return { success: true }; },
    vaciarCarrito: () => { dispatch({ type: 'VACIAR_CARRITO' }); return { success: true }; },
    calcularTotales: () => {
      const subtotal = state.items.reduce((t, i) => t + ((i.precioUnitario || i.producto.precio) * i.cantidad), 0);
      const iva = subtotal * 0.21;
      return { subtotal: subtotal.toFixed(2), iva: iva.toFixed(2), total: (subtotal + iva).toFixed(2), cantidadTotal: state.items.reduce((t, i) => t + i.cantidad, 0) };
    },
    verificarStockDisponible: () => {
      const sinStock = state.items.filter(i => i.cantidad > i.producto.stock);
      return { disponible: sinStock.length === 0, productosSinStock: sinStock.map(i => ({ nombre: i.producto.nombre, stockDisponible: i.producto.stock, cantidadSolicitada: i.cantidad })) };
    },

    // 🔹 Funciones nuevas para Productos.jsx
    estaEnCarrito: (productoId) => state.items.some(i => i.producto.id === productoId),
    obtenerCantidadProducto: (productoId) => {
      const item = state.items.find(i => i.producto.id === productoId);
      return item ? item.cantidad : 0;
    }
  };

  useEffect(() => { acciones.cargarCarrito(); }, []);
  useEffect(() => {
    const handleStorageChange = () => { 
      const usuarioId = obtenerUsuarioDelToken(); 
      if (usuarioId) acciones.migrarCarrito(usuarioId); 
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return <CarritoContext.Provider value={{ items: state.items, cargando: state.cargando, ...acciones }}>{children}</CarritoContext.Provider>;
};

export const useCarrito = () => { 
  const context = useContext(CarritoContext); 
  if (!context) throw new Error('useCarrito debe usarse dentro de CarritoProvider'); 
  return context; 
};
