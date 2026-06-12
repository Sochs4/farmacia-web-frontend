import { Search, Pencil, Trash2 } from "lucide-react";

function TablaProductos({
  productos,
  busqueda,
  setBusqueda,
  filtro,
  setFiltro,
  editarProducto,
  eliminarProducto,
}) {
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const esBajoStock =
      p.alertaStock && p.stock > 0 && p.stock <= p.stockMinimo;

    const agotado = p.stock <= 0;

    if (filtro === "bajo") return coincideBusqueda && esBajoStock;
    if (filtro === "agotados") return coincideBusqueda && agotado;
    if (filtro === "sinAlerta") return coincideBusqueda && !p.alertaStock;

    return coincideBusqueda;
  });

  return (
    <div className="productos-panel">
      <div className="productos-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="bajo">Bajo stock</option>
          <option value="agotados">Agotados</option>
          <option value="sinAlerta">Sin alerta</option>
        </select>
      </div>

      <table className="tabla productos-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Unidad base</th>
            <th>Stock total</th>
            <th>Compra total</th>
            <th>Unidades/presentación</th>
            <th>Costo unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.map((p) => {
            const costoUnidad =
              Number(p.contenidoCompra) > 0
                ? Number(p.precioCompra) / Number(p.contenidoCompra)
                : 0;

            return (
              <tr
                key={p.id}
                className={
                  p.alertaStock && p.stock <= p.stockMinimo
                    ? "fila-alerta"
                    : ""
                }
              >
                <td>
                  <strong>{p.nombre}</strong>
                </td>

                <td>{p.categoria}</td>

                <td>{p.unidadMedida}</td>

                <td>
                  {p.stock} unidades
                </td>

                <td>Q {Number(p.precioCompra).toFixed(2)}</td>

                <td>{p.contenidoCompra || 1}</td>

                <td>Q {costoUnidad.toFixed(2)}</td>

                <td>
                  <button
                    className="btn-edit"
                    onClick={() => editarProducto(p)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TablaProductos;
