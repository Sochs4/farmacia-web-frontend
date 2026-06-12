import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { Boxes, PackageCheck, AlertTriangle, Ban, Search } from "lucide-react";
import { formatearStockCompuesto } from "../utils/stock";

function Inventario({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [agotados, setAgotados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  async function cargarInventario() {
    const r1 = await api.get("/Inventario/bajo-stock");
    const r2 = await api.get("/Inventario/agotados");
    const r3 = await api.get("/Productos");

    const productosConPresentaciones = await Promise.all(
      r3.data.map(async (producto) => {
        try {
          const res = await api.get(
            `/PresentacionesProducto/producto/${producto.id}`
          );

          return {
            ...producto,
            presentaciones: res.data || [],
          };
        } catch {
          return {
            ...producto,
            presentaciones: [],
          };
        }
      })
    );

    setBajoStock(r1.data);
    setAgotados(r2.data);
    setProductos(productosConPresentaciones);
  }

  useEffect(() => {
    cargarInventario();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.nombre || "";
    const categoria = p.categoria || "";

    const coincideBusqueda =
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.toLowerCase().includes(busqueda.toLowerCase());

    const bajo = p.alertaStock && p.stock > 0 && p.stock <= p.stockMinimo;
    const agotado = p.stock <= 0;

    if (filtro === "bajo") return coincideBusqueda && bajo;
    if (filtro === "agotados") return coincideBusqueda && agotado;
    if (filtro === "sinAlerta") return coincideBusqueda && !p.alertaStock;

    return coincideBusqueda;
  });

  const hoy = new Date().toISOString().substring(0, 10);
  const limiteVencimiento = new Date();
  limiteVencimiento.setDate(limiteVencimiento.getDate() + 30);
  const fechaLimite = limiteVencimiento.toISOString().substring(0, 10);

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <Boxes size={34} />
        </div>

        <div>
          <span>Control de stock</span>
          <h1>Inventario</h1>
          <p>Consulta existencias por unidad, caja, blister y presentación.</p>
        </div>
      </div>

      <div className="productos-stats">
        <div className="mini-stat">
          <PackageCheck />
          <div>
            <p>Total productos</p>
            <strong>{productos.length}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <AlertTriangle />
          <div>
            <p>Bajo stock</p>
            <strong>{bajoStock.length}</strong>
          </div>
        </div>

        <div className="mini-stat danger">
          <Ban />
          <div>
            <p>Agotados</p>
            <strong>{agotados.length}</strong>
          </div>
        </div>
      </div>

      <div className="productos-panel">
        <h2>Inventario general</h2>

        <div className="productos-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Buscar producto o categoría..."
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
              <th>Stock total</th>
              <th>Equivalencia</th>
              <th>Stock mínimo</th>
              <th>Estado</th>
              <th>Vencimiento</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((p) => {
              const bajo =
                p.alertaStock && p.stock > 0 && p.stock <= p.stockMinimo;
              const agotado = p.stock <= 0;
              const vencimiento = p.fechaVencimiento?.substring(0, 10);
              const vencido = vencimiento && vencimiento < hoy;
              const proximoVencer =
                vencimiento && vencimiento >= hoy && vencimiento <= fechaLimite;

              return (
                <tr
                  key={p.id}
                  className={
                    vencido
                      ? "fila-vencida"
                      : proximoVencer
                      ? "fila-proximo-vencer"
                      : bajo || agotado
                      ? "fila-alerta"
                      : ""
                  }
                >
                  <td>
                    <strong>{p.nombre}</strong>
                  </td>

                  <td>{p.categoria}</td>

                  <td>
                    <strong>{p.stock}</strong> unidades
                  </td>

                  <td>
                    <strong>
                      {formatearStockCompuesto(
                        p.stock,
                        p.presentaciones,
                        p.unidadMedida
                      )}
                    </strong>
                  </td>

                  <td>{p.stockMinimo}</td>

                  <td>
                    {agotado ? (
                      <span className="badge-danger">Agotado</span>
                    ) : bajo ? (
                      <span className="badge-warning">Bajo stock</span>
                    ) : p.alertaStock ? (
                      <span className="badge-success">Disponible</span>
                    ) : (
                      <span>Sin alerta</span>
                    )}
                  </td>

                  <td>
                    {vencido ? (
                      <span className="badge-danger">{vencimiento}</span>
                    ) : proximoVencer ? (
                      <span className="badge-warning">{vencimiento}</span>
                    ) : (
                      vencimiento || "Sin fecha"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="productos-panel">
        <h2>Productos con bajo stock</h2>

        <table className="tabla productos-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock base</th>
              <th>Stock mínimo</th>
            </tr>
          </thead>

          <tbody>
            {bajoStock.map((p) => (
              <tr key={p.id} className="fila-alerta">
                <td>
                  <strong>{p.nombre}</strong>
                </td>
                <td>{p.categoria}</td>
                <td>{p.stock} unidades</td>
                <td>{p.stockMinimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="productos-panel">
        <h2>Productos agotados</h2>

        <table className="tabla productos-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock base</th>
            </tr>
          </thead>

          <tbody>
            {agotados.map((p) => (
              <tr key={p.id} className="fila-alerta">
                <td>
                  <strong>{p.nombre}</strong>
                </td>
                <td>{p.categoria}</td>
                <td>{p.stock} unidades</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Inventario;
