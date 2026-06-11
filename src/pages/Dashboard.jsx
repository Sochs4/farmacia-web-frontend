import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import {
  Wallet,
  ShoppingCart,
  Package,
  AlertTriangle,
  CalendarClock,
  Ban,
  Plus,
  PackagePlus,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

function Dashboard({ setPantalla }) {
  const [resumen, setResumen] = useState(null);
  const [productos, setProductos] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [agotados, setAgotados] = useState([]);
  const [proximos, setProximos] = useState([]);
  const [vencidos, setVencidos] = useState([]);

  async function cargarDashboard() {
    const r1 = await api.get("/Reportes/ventas-dia");
    const r2 = await api.get("/Productos");
    const r3 = await api.get("/Inventario/bajo-stock");
    const r4 = await api.get("/Inventario/agotados");
    const r5 = await api.get("/Inventario/proximos-vencer");
    const r6 = await api.get("/Inventario/vencidos");

    setResumen(r1.data);
    setProductos(r2.data);
    setBajoStock(r3.data);
    setAgotados(r4.data);
    setProximos(r5.data);
    setVencidos(r6.data);
  }

  useEffect(() => {
    cargarDashboard();
  }, []);

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <LayoutDashboard size={34} />
        </div>

        <div>
          <span>Sistema de farmacia</span>
          <h1>Panel principal</h1>
          <p>Resumen rápido de ventas, inventario y alertas importantes.</p>
        </div>
      </div>

      

      <div className="stats-grid">
        <div className="stat-card coral">
          <div className="stat-icon">
            <Wallet size={28} />
          </div>
          <p>Total vendido hoy</p>
          <h2>Q {Number(resumen?.totalVendido ?? 0).toFixed(2)}</h2>
        </div>

        <div className="stat-card teal">
          <div className="stat-icon">
            <ShoppingCart size={28} />
          </div>
          <p>Ventas del día</p>
          <h2>{resumen?.cantidadVentas ?? 0}</h2>
        </div>

        <div className="stat-card mint">
          <div className="stat-icon">
            <Package size={28} />
          </div>
          <p>Productos registrados</p>
          <h2>{productos.length}</h2>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <AlertTriangle size={28} />
          </div>
          <p>Bajo stock</p>
          <h2>{bajoStock.length}</h2>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="pharma-panel">
          <h2>Estado de la farmacia</h2>

          <div className="status-list">
            <div>
              <CalendarClock size={22} />
              <span>Próximos a vencer</span>
              <strong>{proximos.length}</strong>
            </div>

            <div>
              <Ban size={22} />
              <span>Productos vencidos</span>
              <strong>{vencidos.length}</strong>
            </div>

            <div>
              <AlertTriangle size={22} />
              <span>Productos agotados</span>
              <strong>{agotados.length}</strong>
            </div>
          </div>
        </div>

        <div className="pharma-panel">
          <h2>Accesos rápidos</h2>

          <div className="quick-actions">
            <button onClick={() => setPantalla("productos")}>
              <Plus size={20} /> Agregar producto
            </button>

            <button onClick={() => setPantalla("compras")}>
              <PackagePlus size={20} /> Registrar compra
            </button>

            <button onClick={() => setPantalla("inventario")}>
              <Package size={20} /> Inventario
            </button>

            <button onClick={() => setPantalla("vencimientos")}>
              <CalendarClock size={20} /> Vencimientos
            </button>

            <button onClick={() => setPantalla("reportes")}>
              <ClipboardList size={20} /> Reportes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
