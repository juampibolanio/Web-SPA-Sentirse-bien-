import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CarritoContext = createContext();

const initialState = {
  items: [],
  cargando: true
};

const cargarCarritoDesdeStorage = () => {
  try {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    return [];
  }
};

const guardarCarritoEnStorage = (items) => {
  try {
    localStorage.setItem('carrito', JSON.stringify(items));
  } catch (error) {
    console.error('Error al guardar carrito:', error);
  }
};

const carritoReducer = (state, action) => {
  switch (action.type) {
    case 'CARGAR_CARRITO':
      return {
        ...state,
        items: cargarCarritoDesdeStorage(),
        cargando: false
      };

    case 'AGREGAR_ITEM': {
      const itemExistente = state.items.find(item => 
        item.producto.id === action.payload.producto.id
      );
      
      let nuevosItems;
      
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + action.payload.cantidad;
        if (nuevaCantidad > action.payload.producto.stock) {
          alert(`No hay suficiente stock. Máximo: ${action.payload.producto.stock}`);
          return state;
        }
        nuevosItems = state.items.map(item =>
          item.producto.id === action.payload.producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      } else {
        if (action.payload.cantidad > action.payload.producto.stock) {
          alert(`No hay suficiente stock. Máximo: ${action.payload.producto.stock}`);
          return state;
        }
        nuevosItems = [...state.items, action.payload];
      }

      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }

    case 'ACTUALIZAR_CANTIDAD': {
      const item = state.items.find(item => item.id === action.payload.itemId);
      if (!item) return state;

      if (action.payload.cantidad > item.producto.stock) {
        alert(`No hay suficiente stock. Máximo: ${item.producto.stock}`);
        return state;
      }

      const nuevosItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, cantidad: action.payload.cantidad }
          : item
      );

      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }

    case 'ELIMINAR_ITEM': {
      const nuevosItems = state.items.filter(item => item.id !== action.payload);
      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }

    case 'VACIAR_CARRITO':
      guardarCarritoEnStorage([]);
      return { ...state, items: [] };

    case 'ACTUALIZAR_STOCK_PRODUCTOS': {
      const nuevosItems = state.items.map(item => {
        const productoActualizado = action.payload.find(p => p.id === item.producto.id);
        if (productoActualizado) {
          return {
            ...item,
            producto: {
              ...item.producto,
              stock: productoActualizado.stock
            }
          };
        }
        return item;
      }).filter(item => item.producto.stock > 0);

      guardarCarritoEnStorage(nuevosItems);
      return { ...state, items: nuevosItems };
    }

    default:
      return state;
  }
};

export const CarritoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carritoReducer, initialState);

  const acciones = {
    cargarCarrito: () => dispatch({ type: 'CARGAR_CARRITO' }),

    agregarAlCarrito: (producto, cantidad) => {
      const nuevoItem = {
        id: Date.now().toString(),
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen || producto.imagenUrl,
          descripcion: producto.descripcion,
          stock: producto.stock,
          oferta: producto.oferta
        },
        cantidad: cantidad,
        fechaAgregado: new Date().toISOString()
      };

      dispatch({ type: 'AGREGAR_ITEM', payload: nuevoItem });
      return { success: true, item: nuevoItem };
    },

    actualizarCantidad: (itemId, cantidad) => {
      if (cantidad < 1) return { success: false, error: 'La cantidad debe ser al menos 1' };
      dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { itemId, cantidad } });
      return { success: true };
    },

    eliminarDelCarrito: (itemId) => {
      dispatch({ type: 'ELIMINAR_ITEM', payload: itemId });
      return { success: true };
    },

    vaciarCarrito: () => {
      dispatch({ type: 'VACIAR_CARRITO' });
      return { success: true };
    },

    actualizarStockProductos: (productos) => {
      dispatch({ type: 'ACTUALIZAR_STOCK_PRODUCTOS', payload: productos });
    },

    calcularTotales: () => {
      const subtotal = state.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
      const iva = subtotal * 0.21;
      const total = subtotal + iva;

      return {
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: total.toFixed(2),
        cantidadTotal: state.items.reduce((total, item) => total + item.cantidad, 0)
      };
    },

    estaEnCarrito: (productoId) => {
      return state.items.some(item => item.producto.id === productoId);
    },

    obtenerCantidadProducto: (productoId) => {
      const item = state.items.find(item => item.producto.id === productoId);
      return item ? item.cantidad : 0;
    }
  };

  useEffect(() => {
    acciones.cargarCarrito();
  }, []);

  const value = {
    items: state.items,
    cargando: state.cargando,
    ...acciones
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};