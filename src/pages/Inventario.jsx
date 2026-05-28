import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { Boxes, PackageCheck, AlertTriangle, Ban, Search } from "lucide-react";

function Inventario({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [agotados, setAgotados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    const r1 = await api.get("/Inventario/bajo-stock");
    const r2 = await api.get("/Inventario/agotados");
    const r3 = await api.get("/Productos");

    setBajoStock(r1.data);
    setAgotados(r2.data);
    setProductos(r3.data);
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const bajo = p.alertaStock && p.stock > 0 && p.stock <= p.stockMinimo;
    const agotado = p.stock <= 0;

    if (filtro === "bajo") return coincideBusqueda && bajo;
    if (filtro === "agotados") return coincideBusqueda && agotado;
    if (filtro === "sinAlerta") return coincideBusqueda && !p.alertaStock;

    return coincideBusqueda;
  });

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <Boxes size={34} />
        </div>

        <div>
          <span>Control de stock</span>
          <h1>Inventario</h1>
          <p>Consulta existencias, bajo stock y productos agotados.</p>
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
              <th>Unidad</th>
              <th>Stock</th>
              <th>Stock mínimo</th>
              <th>Precio venta</th>
              <th>Vencimiento</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((p) => (
              <tr
                key={p.id}
                className={
                  p.alertaStock && p.stock <= p.stockMinimo
                    ? "fila-alerta"
                    : ""
                }
              >
                <td><strong>{p.nombre}</strong></td>
                <td>{p.categoria}</td>
                <td>{p.unidadMedida}</td>
                <td>{p.stock}</td>
                <td>{p.stockMinimo}</td>
                <td>Q {Number(p.precioVenta).toFixed(2)}</td>
                <td>{p.fechaVencimiento?.substring(0, 10)}</td>
              </tr>
            ))}
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
              <th>Unidad</th>
              <th>Stock</th>
              <th>Stock mínimo</th>
            </tr>
          </thead>

          <tbody>
            {bajoStock.map((p) => (
              <tr key={p.id} className="fila-alerta">
                <td><strong>{p.nombre}</strong></td>
                <td>{p.categoria}</td>
                <td>{p.unidadMedida}</td>
                <td>{p.stock}</td>
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
              <th>Unidad</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {agotados.map((p) => (
              <tr key={p.id} className="fila-alerta">
                <td><strong>{p.nombre}</strong></td>
                <td>{p.categoria}</td>
                <td>{p.unidadMedida}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Inventario;