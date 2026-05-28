import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  FileText,
  Wallet,
  ShoppingCart,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Eye,
  Trash2,
  X,
} from "lucide-react";

function Reportes({ setPantalla }) {
  const [ventas, setVentas] = useState([]);
  const [tab, setTab] = useState("hoy");
  const [fechaSemana, setFechaSemana] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");
  const [fechaHistorial, setFechaHistorial] = useState("");

  const [detalleVenta, setDetalleVenta] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [ventaEliminar, setVentaEliminar] = useState(null);
  const [passwordAdmin, setPasswordAdmin] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    const res = await api.get("/Ventas");
    setVentas(res.data);
  };

  const hoy = new Date().toISOString().substring(0, 10);
  const obtenerFecha = (fecha) => fecha?.substring(0, 10);

  const ventasHoy = ventas.filter((v) => obtenerFecha(v.fecha) === hoy);

  const total = (lista) =>
    lista.reduce((sum, v) => sum + Number(v.total), 0).toFixed(2);

  const obtenerSemana = (fechaBase) => {
    if (!fechaBase) return [];

    const fecha = new Date(fechaBase);
    const dia = fecha.getDay();
    const inicio = new Date(fecha);
    inicio.setDate(fecha.getDate() - dia + 1);

    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);

    return ventas.filter((v) => {
      const fechaVenta = new Date(obtenerFecha(v.fecha));
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
  };

  const ventasSemana = obtenerSemana(fechaSemana);

  const ventasMes = mesFiltro
    ? ventas.filter((v) => obtenerFecha(v.fecha)?.startsWith(mesFiltro))
    : [];

  const ventasHistorial = fechaHistorial
    ? ventas.filter((v) => obtenerFecha(v.fecha) === fechaHistorial)
    : ventas;

  const verDetalle = async (id) => {
    const res = await api.get(`/Ventas/${id}`);
    setDetalleVenta(res.data);
    setMostrarDetalle(true);
  };

  const confirmarEliminar = (id) => {
    setVentaEliminar(id);
    setPasswordAdmin("");
    setMostrarEliminar(true);
  };

  const eliminarVenta = async () => {
    try {
      await api.delete(`/Ventas/${ventaEliminar}?passwordAdmin=${passwordAdmin}`);

      alert("Venta eliminada correctamente y stock restaurado.");

      setMostrarEliminar(false);
      setVentaEliminar(null);
      setPasswordAdmin("");
      cargarVentas();
    } catch (error) {
      alert("Contraseña incorrecta o error al eliminar la venta.");
    }
  };

  const TablaVentas = ({ lista }) => (
    <table className="tabla productos-tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {lista.map((v) => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.clienteNombre}</td>
            <td>{obtenerFecha(v.fecha)}</td>
            <td>Q {Number(v.total).toFixed(2)}</td>
            <td>
              <button className="btn-edit" onClick={() => verDetalle(v.id)}>
                <Eye size={16} />
              </button>

              <button className="btn-delete" onClick={() => confirmarEliminar(v.id)}>
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <FileText size={34} />
        </div>

        <div>
          <span>Reportes de ventas</span>
          <h1>Reportes</h1>
          <p>Consulta ventas por día, semana, mes e historial general.</p>
        </div>
      </div>

      <div className="report-tabs">
        <button className={tab === "hoy" ? "activo" : ""} onClick={() => setTab("hoy")}>
          Hoy
        </button>
        <button className={tab === "semana" ? "activo" : ""} onClick={() => setTab("semana")}>
          Semana
        </button>
        <button className={tab === "mes" ? "activo" : ""} onClick={() => setTab("mes")}>
          Mes
        </button>
        <button className={tab === "historial" ? "activo" : ""} onClick={() => setTab("historial")}>
          Historial
        </button>
      </div>

      {tab === "hoy" && (
        <>
          <div className="productos-stats">
            <div className="mini-stat">
              <Wallet />
              <div>
                <p>Total vendido hoy</p>
                <strong>Q {total(ventasHoy)}</strong>
              </div>
            </div>

            <div className="mini-stat">
              <ShoppingCart />
              <div>
                <p>Ventas realizadas</p>
                <strong>{ventasHoy.length}</strong>
              </div>
            </div>
          </div>

          <div className="productos-panel">
            <h2>Ventas de hoy</h2>
            <TablaVentas lista={ventasHoy} />
          </div>
        </>
      )}

      {tab === "semana" && (
        <>
          <div className="productos-panel">
            <h2>Reporte semanal</h2>

            <div className="productos-toolbar">
              <div className="search-box">
                <CalendarRange size={18} />
                <input
                  type="date"
                  value={fechaSemana}
                  onChange={(e) => setFechaSemana(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="productos-stats">
            <div className="mini-stat">
              <Wallet />
              <div>
                <p>Total semanal</p>
                <strong>Q {total(ventasSemana)}</strong>
              </div>
            </div>

            <div className="mini-stat">
              <ShoppingCart />
              <div>
                <p>Ventas en semana</p>
                <strong>{ventasSemana.length}</strong>
              </div>
            </div>
          </div>

          <div className="productos-panel">
            <h2>Ventas de la semana</h2>
            <TablaVentas lista={ventasSemana} />
          </div>
        </>
      )}

      {tab === "mes" && (
        <>
          <div className="productos-panel">
            <h2>Reporte mensual</h2>

            <div className="productos-toolbar">
              <div className="search-box">
                <CalendarDays size={18} />
                <input
                  type="month"
                  value={mesFiltro}
                  onChange={(e) => setMesFiltro(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="productos-stats">
            <div className="mini-stat">
              <Wallet />
              <div>
                <p>Total mensual</p>
                <strong>Q {total(ventasMes)}</strong>
              </div>
            </div>

            <div className="mini-stat">
              <ShoppingCart />
              <div>
                <p>Ventas del mes</p>
                <strong>{ventasMes.length}</strong>
              </div>
            </div>
          </div>

          <div className="productos-panel">
            <h2>Ventas del mes</h2>
            <TablaVentas lista={ventasMes} />
          </div>
        </>
      )}

      {tab === "historial" && (
        <>
          <div className="productos-panel">
            <h2>Historial general</h2>

            <div className="productos-toolbar">
              <div className="search-box">
                <CalendarClock size={18} />
                <input
                  type="date"
                  value={fechaHistorial}
                  onChange={(e) => setFechaHistorial(e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={() => setFechaHistorial("")}>
                Ver todas
              </button>
            </div>
          </div>

          <div className="productos-stats">
            <div className="mini-stat">
              <Wallet />
              <div>
                <p>Total mostrado</p>
                <strong>Q {total(ventasHistorial)}</strong>
              </div>
            </div>

            <div className="mini-stat">
              <ShoppingCart />
              <div>
                <p>Ventas mostradas</p>
                <strong>{ventasHistorial.length}</strong>
              </div>
            </div>
          </div>

          <div className="productos-panel">
            <TablaVentas lista={ventasHistorial} />
          </div>
        </>
      )}

      {mostrarDetalle && detalleVenta && (
        <div className="modal-bg">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setMostrarDetalle(false)}>
              <X size={18} />
            </button>

            <h2>Detalle de venta</h2>

            <p>
              <strong>Cliente:</strong> {detalleVenta.venta.clienteNombre}
            </p>

            <p>
              <strong>Fecha:</strong> {obtenerFecha(detalleVenta.venta.fecha)}
            </p>

            <p>
              <strong>Total:</strong> Q {Number(detalleVenta.venta.total).toFixed(2)}
            </p>

            <table className="tabla productos-tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {detalleVenta.detalles.map((d, i) => (
                  <tr key={i}>
                    <td>{d.productoNombre}</td>
                    <td>{d.cantidad}</td>
                    <td>Q {Number(d.precioUnitario).toFixed(2)}</td>
                    <td>Q {Number(d.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mostrarEliminar && (
        <div className="modal-bg">
          <div className="modal-box modal-small">
            <button className="modal-close" onClick={() => setMostrarEliminar(false)}>
              <X size={18} />
            </button>

            <h2>Eliminar venta</h2>
            <p>Esta acción eliminará la venta y devolverá el stock de los productos.</p>

            <label>Contraseña del administrador</label>
            <input
              className="modal-input"
              type="password"
              value={passwordAdmin}
              onChange={(e) => setPasswordAdmin(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-delete" onClick={eliminarVenta}>
                Eliminar venta
              </button>

              <button className="btn-edit" onClick={() => setMostrarEliminar(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Reportes;