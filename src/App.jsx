import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Compras from "./pages/Compras";
import Vender from "./pages/Vender/Vender";
import Inventario from "./pages/Inventario";
import Vencimientos from "./pages/Vencimientos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import {
  obtenerPantallaInicial,
  obtenerUsuarioActual,
  puedeVerPantalla,
} from "./utils/permisos";


// 🔥 IMPORTAR TODOS LOS ESTILOS
import "./App.css";
import "./styles/login.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/tablas.css";
import "./styles/productos.css";
import "./styles/ventas.css";
import "./styles/responsive.css";

function App() {
  const [pantalla, setPantallaBase] = useState(() => {
    const usuario = obtenerUsuarioActual();
    return usuario ? obtenerPantallaInicial(usuario) : "login";
  });

  const setPantalla = (nuevaPantalla) => {
    const usuario = obtenerUsuarioActual();

    if (nuevaPantalla === "login" || puedeVerPantalla(usuario, nuevaPantalla)) {
      setPantallaBase(nuevaPantalla);
      return;
    }

    setPantallaBase(obtenerPantallaInicial(usuario));
  };

  const usuario = obtenerUsuarioActual();
  const pantallaActiva =
    pantalla === "login" || puedeVerPantalla(usuario, pantalla)
      ? pantalla
      : obtenerPantallaInicial(usuario);

  return (
    <>
      <Toaster position="top-right" />

      {pantallaActiva === "login" && <Login setPantalla={setPantalla} />}

      {pantallaActiva === "dashboard" && (
        <Dashboard setPantalla={setPantalla} />
      )}

      {pantallaActiva === "productos" && (
        <Productos setPantalla={setPantalla} />
      )}

      {pantallaActiva === "compras" && (
        <Compras setPantalla={setPantalla} />
      )}

      {pantallaActiva === "vender" && (
        <Vender setPantalla={setPantalla} />
      )}

      {pantallaActiva === "inventario" && (
        <Inventario setPantalla={setPantalla} />
      )}

      {pantallaActiva === "vencimientos" && (
        <Vencimientos setPantalla={setPantalla} />
      )}

      {pantallaActiva === "reportes" && (
        <Reportes setPantalla={setPantalla} />
      )}

      {pantallaActiva === "configuracion" && (
        <Configuracion setPantalla={setPantalla} />
      )}

    

      
    </>
  );
}

export default App;
