import {
  ShoppingCart,
  Trash2,
  CheckCircle,
  Minus,
  Plus,
} from "lucide-react";
import { formatearStockCompuesto } from "../../utils/stock";

function CarritoVenta({
  carrito,
  clienteNombre,
  setClienteNombre,
  presentaciones,
  cambiarPresentacion,
  cambiarCantidad,
  eliminarDelCarrito,
  total,
  finalizarVenta,
}) {
  const aumentar = (item) => {
    cambiarCantidad(item.carritoKey, item.cantidad + 1);
  };

  const disminuir = (item) => {
    if (item.cantidad <= 1) return;
    cambiarCantidad(item.carritoKey, item.cantidad - 1);
  };

  const calcularMaximo = (item) => {
    const stock = Number(item.stock) || 0;
    const factor = Number(item.factorConversion) || 1;
    return Math.floor(stock / factor);
  };

  return (
    <div className="panel carrito-panel">
      <h2>Carrito de venta</h2>

      <label>Cliente</label>
      <input
        value={clienteNombre}
        onChange={(e) => setClienteNombre(e.target.value)}
      />

      {carrito.length === 0 && (
        <div className="carrito-vacio">
          <ShoppingCart size={34} />
          <p>No hay productos agregados.</p>
        </div>
      )}

      {carrito.map((item) => {
        const maximo = calcularMaximo(item);

        return (
          <div className="carrito-item" key={item.carritoKey}>
            <div className="carrito-info">
              <strong>{item.nombre}</strong>

              <select
                value={item.presentacionProductoId || ""}
                onChange={(e) =>
                  cambiarPresentacion(item.carritoKey, e.target.value)
                }
              >
                {presentaciones[item.id]?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - Q {Number(p.precioVenta).toFixed(2)}
                  </option>
                ))}
              </select>

              <p>
                Q {Number(item.precioSeleccionado).toFixed(2)} /{" "}
                {item.presentacionNombre}
              </p>

              <small>
                Disponible: {maximo} {item.presentacionNombre}
              </small>

              <small>
                Stock total:{" "}
                {formatearStockCompuesto(
                  item.stock,
                  presentaciones[item.id],
                  item.unidadMedida
                )}
              </small>
            </div>

            <div className="cantidad-control">
              <button
                type="button"
                className="btn-delete"
                onClick={() => disminuir(item)}
              >
                <Minus size={18} />
              </button>

              <input
                type="number"
                min="1"
                max={maximo}
                value={item.cantidad}
                onChange={(e) =>
                  cambiarCantidad(item.carritoKey, e.target.value)
                }
              />

              <button
                type="button"
                className="btn-primary"
                onClick={() => aumentar(item)}
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="carrito-subtotal">
              Q {(item.precioSeleccionado * item.cantidad).toFixed(2)}
            </div>

            <button
              type="button"
              className="btn-delete carrito-eliminar"
              onClick={() => eliminarDelCarrito(item.carritoKey)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}

      <div className="total-box">
        <p>Total a pagar</p>
        <h2>Q {total.toFixed(2)}</h2>
      </div>

      <button className="btn-primary venta-btn" onClick={finalizarVenta}>
        <CheckCircle size={18} />
        Finalizar venta
      </button>
    </div>
  );
}

export default CarritoVenta;
