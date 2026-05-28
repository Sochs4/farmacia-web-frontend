import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Vender from "./pages/Vender";
import Inventario from "./pages/Inventario";
import Vencimientos from "./pages/Vencimientos";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

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
  const [pantalla, setPantalla] = useState("login");

  return (
    <>
      <Toaster position="top-right" />

      {pantalla === "login" && <Login setPantalla={setPantalla} />}

      {pantalla === "dashboard" && (
        <Dashboard setPantalla={setPantalla} />
      )}

      {pantalla === "productos" && (
        <Productos setPantalla={setPantalla} />
      )}

      {pantalla === "vender" && (
        <Vender setPantalla={setPantalla} />
      )}

      {pantalla === "inventario" && (
        <Inventario setPantalla={setPantalla} />
      )}

      {pantalla === "vencimientos" && (
        <Vencimientos setPantalla={setPantalla} />
      )}

      {pantalla === "reportes" && (
        <Reportes setPantalla={setPantalla} />
      )}

      {pantalla === "configuracion" && (
        <Configuracion setPantalla={setPantalla} />
      )}

    

      
    </>
  );
}

export default App;