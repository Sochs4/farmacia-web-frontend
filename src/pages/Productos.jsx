import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  PackageCheck,
  AlertTriangle,
  Pill,
} from "lucide-react";

function Productos({ setPantalla }) {
  const productoVacio = {
    id: 0,
    nombre: "",
    categoria: "",
    unidadMedida: "",
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 10,
    alertaStock: true,
    fechaVencimiento: "",
    activo: true,
  };

  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(productoVacio);
  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await api.get("/Productos");
    setProductos(res.data);
  };

  const guardarProducto = async () => {
    if (editando) {
      await api.put(`/Productos/${producto.id}`, producto);
    } else {
      await api.post("/Productos", producto);
    }

    setProducto(productoVacio);
    setEditando(false);
    cargarProductos();
  };

  const editarProducto = (p) => {
    setProducto({
      ...p,
      fechaVencimiento: p.fechaVencimiento?.substring(0, 10),
    });

    setEditando(true);
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    await api.delete(`/Productos/${id}`);
    cargarProductos();
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());

    const esBajoStock =
      p.alertaStock &&
      p.stock > 0 &&
      p.stock <= p.stockMinimo;

    const agotado = p.stock <= 0;

    if (filtro === "bajo") return coincideBusqueda && esBajoStock;
    if (filtro === "agotados") return coincideBusqueda && agotado;
    if (filtro === "sinAlerta") return coincideBusqueda && !p.alertaStock;

    return coincideBusqueda;
  });

  return (
    <Layout setPantalla={setPantalla}>

      {/* HEADER */}
      <div className="page-header">
        <div className="page-icon">
          <Pill size={34} />
        </div>

        <div>
          <span>Gestión de inventario</span>
          <h1>Productos</h1>
          <p>Administra medicamentos, precios, stock y ganancias.</p>
        </div>
      </div>

      {/* STATS */}
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
            <strong>
              {
                productos.filter(
                  (p) =>
                    p.alertaStock &&
                    p.stock > 0 &&
                    p.stock <= p.stockMinimo
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="productos-panel">
        <h2>
          {editando ? "Editar producto" : "Agregar producto"}
        </h2>

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
            <label>Unidad</label>
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
              <option value="Tableta">Tableta</option>
              <option value="Unidad">Unidad</option>
              <option value="Frasco">Frasco</option>
              <option value="Caja">Caja</option>
            </select>
          </div>

          <div className="campo">
            <label>Precio compra</label>
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
            <label>Precio venta</label>
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
            <label>Stock</label>
            <input
              type="number"
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

        <button className="btn-primary" onClick={guardarProducto}>
          <Plus size={18} />
          {editando ? "Actualizar" : "Guardar"}
        </button>
      </div>

      {/* TABLA */}
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

          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="bajo">Bajo stock</option>
            <option value="agotados">Agotados</option>
          </select>
        </div>

        <table className="tabla productos-tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Compra</th>
              <th>Venta</th>
              <th>Ganancia</th>
              <th>Margen %</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.map((p) => {

              const ganancia =
                Number(p.precioVenta) - Number(p.precioCompra);

              const margen =
                p.precioCompra > 0
                  ? (
                      (ganancia / Number(p.precioCompra)) *
                      100
                    ).toFixed(2)
                  : 0;

              return (
                <tr
                  key={p.id}
                  className={
                    p.alertaStock &&
                    p.stock <= p.stockMinimo
                      ? "fila-alerta"
                      : ""
                  }
                >
                  <td>
                    <strong>{p.nombre}</strong>
                  </td>

                  <td>{p.categoria}</td>

                  <td>{p.stock}</td>

                  <td>
                    Q {Number(p.precioCompra).toFixed(2)}
                  </td>

                  <td>
                    Q {Number(p.precioVenta).toFixed(2)}
                  </td>

                  <td style={{ color: "#16a34a", fontWeight: "800" }}>
                    Q {ganancia.toFixed(2)}
                  </td>

                  <td style={{ color: "#2563eb", fontWeight: "800" }}>
                    {margen}%
                  </td>

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
    </Layout>
  );
}

export default Productos;