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
  const admin = usuario?.rol === ROLES.ADMIN;

  const opciones = [
    {
      pantalla: "dashboard",
      texto: "Dashboard",
      icono: <LayoutDashboard size={20} />,
      adminMobilePrincipal: true,
      adminMobileOrden: 1,
    },
    {
      pantalla: "productos",
      texto: "Productos",
      icono: <Pill size={20} />,
      adminMobilePrincipal: true,
      adminMobileOrden: 3,
    },
    {
      pantalla: "compras",
      texto: "Compras",
      icono: <PackagePlus size={20} />,
      adminMobilePrincipal: true,
      adminMobileOrden: 4,
    },
    {
      pantalla: "vender",
      texto: "Vender",
      icono: <CreditCard size={20} />,
      adminMobilePrincipal: true,
      adminMobileOrden: 2,
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
      textoMovil: "Menu",
      icono: <Settings size={20} />,
      adminMobilePrincipal: true,
      adminMobileOrden: 5,
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

  const sidebarClases = [
    "sidebar",
    vendedor ? "vendedor-sidebar" : "",
    admin ? "admin-sidebar" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const obtenerClaseOpcion = (opcion) => {
    if (!admin) return "";

    return opcion.adminMobilePrincipal
      ? "admin-mobile-principal"
      : "admin-mobile-extra";
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setPantalla("login");
  };

  return (
    <div className="layout">
      <aside className={sidebarClases}>
        <h2 className="logo-area">
          <img src={logo} alt="Logo" className="logo-img" />
        </h2>

        {opcionesVisibles.map((opcion) => (
          <button
            key={opcion.pantalla}
            className={obtenerClaseOpcion(opcion)}
            style={
              opcion.adminMobileOrden
                ? { "--mobile-order": opcion.adminMobileOrden }
                : undefined
            }
            onClick={() => setPantalla(opcion.pantalla)}
          >
            {opcion.icono}
            <span className="nav-text nav-text-desktop">{opcion.texto}</span>
            <span className="nav-text nav-text-mobile">
              {opcion.textoMovil || opcion.texto}
            </span>
          </button>
        ))}

        <button className="logout" onClick={cerrarSesion}>
          <LogOut size={20} />
          <span className="nav-text nav-text-desktop">Cerrar sesion</span>
          <span className="nav-text nav-text-mobile">Salir</span>
        </button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
