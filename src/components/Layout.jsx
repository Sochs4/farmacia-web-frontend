import {
  LayoutDashboard,
  Pill,
  CreditCard,
  Boxes,
  CalendarClock,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import logo from "../assets/logo.png";

function Layout({ children, setPantalla }) {

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setPantalla("login");
  };

  return (
    <div className="layout">

      <aside className="sidebar">

        <h2 className="logo-area">
          <img src={logo} alt="Logo" className="logo-img" />
        </h2>

        <button onClick={() => setPantalla("dashboard")}>
          <LayoutDashboard size={20} /> Dashboard
        </button>

        <button onClick={() => setPantalla("productos")}>
          <Pill size={20} /> Productos
        </button>

        <button onClick={() => setPantalla("vender")}>
          <CreditCard size={20} /> Vender
        </button>

        <button onClick={() => setPantalla("inventario")}>
          <Boxes size={20} /> Inventario
        </button>

        <button onClick={() => setPantalla("vencimientos")}>
          <CalendarClock size={20} /> Vencimientos
        </button>

        <button onClick={() => setPantalla("reportes")}>
          <FileText size={20} /> Reportes
        </button>

        {/* 🔐 CONFIGURACIÓN */}
        <button onClick={() => setPantalla("configuracion")}>
          <Settings size={20} /> Configuración
        </button>

        {/* 🚪 CERRAR SESIÓN */}
        <button className="logout" onClick={cerrarSesion}>
          <LogOut size={20} /> Cerrar sesión
        </button>

      </aside>

      <main className="main-content">
        {children}
      </main>

    </div>
  );
}

export default Layout;