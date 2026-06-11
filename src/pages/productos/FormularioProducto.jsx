import { calcularStockTotal } from "../../utils/stock";

function FormularioProducto({ producto, setProducto }) {
  const actualizarCantidadPresentaciones = (valor) => {
    const stockTotal =
      valor === ""
        ? producto.stock
        : calcularStockTotal(valor, producto.contenidoCompra);

    setProducto({
      ...producto,
      cantidadPresentaciones: valor,
      stock: stockTotal,
    });
  };

  const actualizarContenidoCompra = (valor) => {
    const contenidoCompra = Number(valor) || 1;
    const tieneCantidad =
      producto.cantidadPresentaciones !== undefined &&
      producto.cantidadPresentaciones !== "";

    setProducto({
      ...producto,
      contenidoCompra,
      stock: tieneCantidad
        ? calcularStockTotal(producto.cantidadPresentaciones, contenidoCompra)
        : producto.stock,
    });
  };

  return (
    <div className="form-grid">
      <div className="campo">
        <label>Nombre del producto</label>
        <input
          value={producto.nombre}
          onChange={(e) =>
            setProducto({
              ...producto,
              nombre: e.target.value,
            })
          }
        />
      </div>

      <div className="campo">
        <label>Categoría</label>
        <input
          value={producto.categoria}
          onChange={(e) =>
            setProducto({
              ...producto,
              categoria: e.target.value,
            })
          }
        />
      </div>

      <div className="campo">
        <label>Unidad mínima</label>
        <select
          value={producto.unidadMedida}
          onChange={(e) =>
            setProducto({
              ...producto,
              unidadMedida: e.target.value,
            })
          }
        >
          <option value="">Seleccione</option>
          <option value="Unidad">Unidad</option>
          <option value="Tableta">Tableta</option>
          <option value="Blister">Blister</option>
          <option value="Caja">Caja</option>
          <option value="Ampolla">Ampolla</option>
          <option value="Inyección">Inyección</option>
          <option value="Frasco">Frasco</option>
          <option value="Sobre">Sobre</option>
          <option value="Tubo">Tubo</option>
          <option value="Bolsa">Bolsa</option>
        </select>
      </div>

      <div className="campo">
        <label>Costo compra total</label>
        <input
          type="number"
          value={producto.precioCompra}
          onChange={(e) =>
            setProducto({
              ...producto,
              precioCompra: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="campo">
        <label>Cantidad recibida</label>
        <input
          type="number"
          min="0"
          value={producto.cantidadPresentaciones ?? ""}
          onChange={(e) => actualizarCantidadPresentaciones(e.target.value)}
        />
      </div>

      <div className="campo">
        <label>Unidades por presentación</label>
        <input
          type="number"
          min="1"
          value={producto.contenidoCompra}
          onChange={(e) => actualizarContenidoCompra(e.target.value)}
        />
      </div>

      <div className="campo">
        <label>Precio unidad mínima</label>
        <input
          type="number"
          value={producto.precioVenta}
          onChange={(e) =>
            setProducto({
              ...producto,
              precioVenta: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="campo">
        <label>Stock total mínimo</label>
        <input
          type="number"
          min="0"
          value={producto.stock}
          onChange={(e) =>
            setProducto({
              ...producto,
              stock: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="campo">
        <label>Stock mínimo</label>
        <input
          type="number"
          value={producto.stockMinimo}
          onChange={(e) =>
            setProducto({
              ...producto,
              stockMinimo: Number(e.target.value),
            })
          }
        />
      </div>

      <div className="campo">
        <label>Alerta</label>
        <select
          value={producto.alertaStock ? "true" : "false"}
          onChange={(e) =>
            setProducto({
              ...producto,
              alertaStock: e.target.value === "true",
            })
          }
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="campo">
        <label>Vencimiento</label>
        <input
          type="date"
          value={producto.fechaVencimiento}
          onChange={(e) =>
            setProducto({
              ...producto,
              fechaVencimiento: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

export default FormularioProducto;
