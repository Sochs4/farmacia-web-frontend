import {
  LayoutDashboard,
  Pill,
  PackagePlus,
  CreditCard,
  Boxes,
  CalendarClock,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
} from "lucide-react";

import logo from "../assets/logo.png";
import { ROLES, obtenerUsuarioActual, puedeVerPantalla } from "../utils/permisos";

function Layout({ children, setPantalla }) {
  const usuario = obtenerUsuarioActual();
  const vendedor = usuario?.rol === ROLES.VENDEDOR;

  const opciones = [
    {
      pantalla: "dashboard",
      texto: "Dashboard",
      icono: <LayoutDashboard size={20} />,
    },
    {
      pantalla: "productos",
      texto: "Productos",
      icono: <Pill size={20} />,
    },
    {
      pantalla: "compras",
      texto: "Compras",
      icono: <PackagePlus size={20} />,
    },
    {
      pantalla: "vender",
      texto: "Vender",
      icono: <CreditCard size={20} />,
    },
    {
      pantalla: "inventario",
      texto: "Inventario",
      icono: <Boxes size={20} />,
    },
    {
      pantalla: "vencimientos",
      texto: "Vencimientos",
      icono: <CalendarClock size={20} />,
    },
    {
      pantalla: "reportes",
      texto: "Reportes",
      icono: <FileText size={20} />,
    },
    {
      pantalla: "configuracion",
      texto: "Configuracion",
      icono: <Settings size={20} />,
    },
  ];

  const opcionesVendedor = [
    {
      pantalla: "vender",
      texto: "Vender",
      icono: <CreditCard size={20} />,
    },
    {
      pantalla: "inventario",
      texto: "Buscar",
      icono: <Search size={20} />,
    },
    {
      pantalla: "vencimientos",
      texto: "Alertas",
      icono: <Bell size={20} />,
    },
    {
      pantalla: "reportes",
      texto: "Reportes",
      icono: <FileText size={20} />,
    },
    {
      pantalla: "configuracion",
      texto: "Menu",
      icono: <Menu size={20} />,
    },
  ];

  const opcionesVisibles = (vendedor ? opcionesVendedor : opciones).filter(
    (opcion) => puedeVerPantalla(usuario, opcion.pantalla),
  );

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setPantalla("login");
  };

  return (
    <div className="layout">
      <aside className={vendedor ? "sidebar vendedor-sidebar" : "sidebar"}>
        <h2 className="logo-area">
          <img src={logo} alt="Logo" className="logo-img" />
        </h2>

        {opcionesVisibles.map((opcion) => (
          <button
            key={opcion.pantalla}
            onClick={() => setPantalla(opcion.pantalla)}
          >
            {opcion.icono} {opcion.texto}
          </button>
        ))}

        <button className="logout" onClick={cerrarSesion}>
          <LogOut size={20} /> Cerrar sesion
        </button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
