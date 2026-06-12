import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import api from "../services/api";
import { PackagePlus, Save, Search, Boxes, Wallet } from "lucide-react";
import { formatearStockCompuesto } from "../utils/stock";

function Compras({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [presentacionId, setPresentacionId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioCompraTotal, setPrecioCompraTotal] = useState("");
  const [precioVentaUnidad, setPrecioVentaUnidad] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function cargarProductos() {
    const res = await api.get("/Productos");
    setProductos(res.data.filter((p) => p.activo !== false));
  }

  async function cargarPresentaciones(id) {
    if (!id) {
      setPresentaciones([]);
      return;
    }

    const res = await api.get(`/PresentacionesProducto/producto/${id}`);
    setPresentaciones(res.data || []);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    cargarPresentaciones(productoId);
  }, [productoId]);

  const productoSeleccionado = productos.find((p) => p.id === Number(productoId));

  const opcionesPresentacion = useMemo(() => {
    if (!productoSeleccionado) return [];
    const tieneUnidadConfigurada = presentaciones.some(
      (p) => Number(p.factorConversion) === 1
    );
    const usaPresentacionesMayores = presentaciones.some(
      (p) => Number(p.factorConversion) > 1
    );
    const unidadMinima = usaPresentacionesMayores
      ? "Unidad"
      : productoSeleccionado.unidadMedida || "Unidad";

    if (tieneUnidadConfigurada) return presentaciones;

    return [{ id: "", nombre: unidadMinima, factorConversion: 1 }, ...presentaciones];
  }, [productoSeleccionado, presentaciones]);

  const presentacionSeleccionada =
    opcionesPresentacion.find((p) => String(p.id) === String(presentacionId)) ||
    opcionesPresentacion[0];

  const unidadesIngresadas =
    (Number(cantidad) || 0) *
    (Number(presentacionSeleccionada?.factorConversion) || 1);

  const stockProyectado = productoSeleccionado
    ? Number(productoSeleccionado.stock || 0) + unidadesIngresadas
    : 0;

  const productosFiltrados = productos.filter((p) => {
    const texto = `${p.nombre || ""} ${p.categoria || ""}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const seleccionarProducto = (id) => {
    const producto = productos.find((p) => p.id === Number(id));

    setProductoId(id);
    setPresentacionId("");
    setResultado(null);
    setPrecioCompraTotal(producto?.precioCompra ?? "");
    setPrecioVentaUnidad(producto?.precioVenta ?? "");
    setFechaVencimiento(producto?.fechaVencimiento?.substring(0, 10) || "");
  };

  const registrarCompra = async (e) => {
    e.preventDefault();

    if (!productoId) {
      toast.error("Selecciona un producto.");
      return;
    }

    if (Number(cantidad) <= 0) {
      toast.error("La cantidad recibida debe ser mayor a 0.");
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        productoId: Number(productoId),
        presentacionProductoId: presentacionId ? Number(presentacionId) : null,
        cantidad: Number(cantidad),
        precioCompraTotal:
          precioCompraTotal === "" ? null : Number(precioCompraTotal),
        precioVentaUnidad:
          precioVentaUnidad === "" ? null : Number(precioVentaUnidad),
        fechaVencimiento: fechaVencimiento || null,
      };

      const res = await api.post("/Compras/registrar", payload);

      toast.success("Compra registrada correctamente");
      setResultado(res.data);
      setCantidad(1);

      await cargarProductos();
    } catch (error) {
      toast.error(error.response?.data || "No se pudo registrar la compra.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <PackagePlus size={34} />
        </div>

        <div>
          <span>Entrada de producto</span>
          <h1>Compras</h1>
          <p>Registra producto recibido y actualiza stock por presentación.</p>
        </div>
      </div>

      <div className="productos-stats">
        <div className="mini-stat">
          <Boxes />
          <div>
            <p>Productos disponibles</p>
            <strong>{productos.length}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <Wallet />
          <div>
            <p>Unidades a ingresar</p>
            <strong>{unidadesIngresadas}</strong>
          </div>
        </div>
      </div>

      <div className="compras-layout">
        <div className="productos-panel">
          <h2>Seleccionar producto</h2>

          <div className="productos-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Buscar producto o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="compras-lista">
            {productosFiltrados.map((p) => (
              <button
                key={p.id}
                type="button"
                className={p.id === Number(productoId) ? "activo" : ""}
                onClick={() => seleccionarProducto(String(p.id))}
              >
                <span>
                  <strong>{p.nombre}</strong>
                  <small>{p.categoria || "Sin categoría"}</small>
                </span>
                <b>{p.stock} unidades</b>
              </button>
            ))}
          </div>
        </div>

        <div className="productos-panel">
          <h2>Registrar entrada</h2>

          <form onSubmit={registrarCompra}>
            <div className="form-grid compras-form">
              <div className="campo">
                <label>Presentación recibida</label>
                <select
                  value={presentacionId}
                  onChange={(e) => setPresentacionId(e.target.value)}
                  disabled={!productoSeleccionado}
                >
                  {opcionesPresentacion.map((p) => (
                    <option key={p.id || "base"} value={p.id}>
                      {p.nombre} ({p.factorConversion} unidad(es))
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label>Cantidad recibida</label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Fecha vencimiento</label>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Costo compra total</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioCompraTotal}
                  onChange={(e) => setPrecioCompraTotal(e.target.value)}
                />
              </div>

              <div className="campo">
                <label>Precio unidad mínima</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioVentaUnidad}
                  onChange={(e) => setPrecioVentaUnidad(e.target.value)}
                />
              </div>
            </div>

            {productoSeleccionado && (
              <div className="compra-preview">
                <div>
                  <span>Stock actual</span>
                  <strong>
                    {formatearStockCompuesto(
                      productoSeleccionado.stock,
                      presentaciones,
                      productoSeleccionado.unidadMedida
                    )}
                  </strong>
                </div>

                <div>
                  <span>Entrarán</span>
                  <strong>
                    {unidadesIngresadas} unidades
                  </strong>
                </div>

                <div>
                  <span>Stock después</span>
                  <strong>
                    {formatearStockCompuesto(
                      stockProyectado,
                      presentaciones,
                      productoSeleccionado.unidadMedida
                    )}
                  </strong>
                </div>
              </div>
            )}

            <button className="btn-primary" type="submit" disabled={guardando}>
              <Save size={18} />
              {guardando ? "Guardando..." : "Registrar compra"}
            </button>
          </form>

          {resultado && (
            <div className="compra-resultado">
              <strong>{resultado.nombre}</strong>
              <span>
                +{resultado.unidadesIngresadas} unidades. Stock actual:{" "}
                {resultado.stockActual}
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Compras;
