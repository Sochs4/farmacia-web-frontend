import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  CalendarClock,
  AlertTriangle,
  Ban,
} from "lucide-react";

function Vencimientos({ setPantalla }) {
  const [proximos, setProximos] = useState([]);
  const [vencidos, setVencidos] = useState([]);

  useEffect(() => {
    cargarVencimientos();
  }, []);

  const cargarVencimientos = async () => {
    try {
      const r1 = await api.get("/Inventario/proximos-vencer");
      const r2 = await api.get("/Inventario/vencidos");

      setProximos(r1.data);
      setVencidos(r2.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout setPantalla={setPantalla}>
      {/* HEADER */}
      <div className="page-header">
        <div className="page-icon">
          <CalendarClock size={34} />
        </div>

        <div>
          <span>Control de vencimientos</span>
          <h1>Vencimientos</h1>
          <p>
            Monitorea productos próximos a vencer y vencidos.
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="productos-stats">
        <div className="mini-stat">
          <CalendarClock />
          <div>
            <p>Próximos a vencer</p>
            <strong>{proximos.length}</strong>
          </div>
        </div>

        <div className="mini-stat danger">
          <Ban />
          <div>
            <p>Productos vencidos</p>
            <strong>{vencidos.length}</strong>
          </div>
        </div>
      </div>

      {/* PROXIMOS */}
      <div className="panel">
        <h2>Próximos a vencer</h2>

        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Fecha vencimiento</th>
            </tr>
          </thead>

          <tbody>
            {proximos.map((p) => (
              <tr
                key={p.id}
                className="fila-alerta"
              >
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.stock}</td>
                <td>
                  {p.fechaVencimiento?.substring(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VENCIDOS */}
      <div className="panel">
        <h2>Productos vencidos</h2>

        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Fecha vencimiento</th>
            </tr>
          </thead>

          <tbody>
            {vencidos.map((p) => (
              <tr
                key={p.id}
                className="fila-vencida"
              >
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.stock}</td>
                <td>
                  {p.fechaVencimiento?.substring(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Vencimientos;