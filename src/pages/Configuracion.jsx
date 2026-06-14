import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Layout from "../components/Layout";
import { Settings, Lock, ShieldCheck, LogOut } from "lucide-react";
import { UsuariosAdmin } from "./Usuarios";
import { esAdmin } from "../utils/permisos";

export default function Configuracion({ setPantalla }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const admin = esAdmin(usuario);

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const cambiarPassword = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }

    try {
      await api.post("/usuarios/cambiar-password", {
        usuarioId: usuario.id,
        passwordActual,
        nuevaPassword,
        confirmarPassword,
      });

      toast.success("Contrasena actualizada correctamente");

      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      toast.error(error.response?.data || "Error al cambiar contrasena");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setPantalla("login");
  };

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <Settings size={34} />
        </div>

        <div>
          <span>{usuario?.rol || "Usuario"}</span>
          <h1>Configuracion</h1>
          <p>Administra la seguridad de tu cuenta.</p>
        </div>
      </div>

      <div className="productos-stats">
        <div className="mini-stat">
          <ShieldCheck />
          <div>
            <p>Usuario activo</p>
            <strong>{usuario?.nombreUsuario || "Usuario"}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <Lock />
          <div>
            <p>Rol</p>
            <strong>{usuario?.rol || "Sin rol"}</strong>
          </div>
        </div>
      </div>

      <div className="productos-panel">
        <h2>Cambiar contrasena</h2>

        <form onSubmit={cambiarPassword}>
          <div className="form-grid">
            <div className="campo">
              <label>Contrasena actual</label>
              <input
                type="password"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="Ingrese contrasena actual"
                required
              />
            </div>

            <div className="campo">
              <label>Nueva contrasena</label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Ingrese nueva contrasena"
                required
              />
            </div>

            <div className="campo">
              <label>Confirmar contrasena</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repita la nueva contrasena"
                required
              />
            </div>
          </div>

          <button className="btn-primary" type="submit">
            <Lock size={18} />
            Guardar contrasena
          </button>
        </form>

        <button className="btn-delete config-logout" type="button" onClick={cerrarSesion}>
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </div>

      {admin && (
        <>
          <div className="config-section-title">
            <h2>Administrar usuarios</h2>
            <p>Crear vendedores, cambiar roles y activar o desactivar accesos.</p>
          </div>

          <UsuariosAdmin />
        </>
      )}
    </Layout>
  );
}
