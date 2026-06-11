import { Plus, ShoppingCart } from "lucide-react";
import { formatearStockCompuesto } from "../../utils/stock";

function ProductoVentaCard({ producto, presentaciones, agregarCarrito }) {
  const precioMostrar =
    presentaciones.length > 0
      ? presentaciones[0].precioVenta
      : producto.precioVenta;

  const nombrePresentacion =
    presentaciones.length > 0
      ? presentaciones[0].nombre
      : producto.unidadMedida || "Unidad";

  return (
    <div className="producto-card">
      <div className="producto-icon">
        <Plus size={22} />
      </div>

      <h3>{producto.nombre}</h3>
      <p>{producto.categoria}</p>
      <p>{nombrePresentacion}</p>

      <strong>Q {Number(precioMostrar || 0).toFixed(2)}</strong>

      <span>
        Stock:{" "}
        {formatearStockCompuesto(
          producto.stock,
          presentaciones,
          producto.unidadMedida
        )}
      </span>

      <button onClick={() => agregarCarrito(producto)}>
        <ShoppingCart size={17} />
        Agregar
      </button>
    </div>
  );
}

export default ProductoVentaCard;
