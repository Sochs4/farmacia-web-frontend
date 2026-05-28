import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Layout from "../components/Layout";
import { Settings, Lock, ShieldCheck } from "lucide-react";

export default function Configuracion({ setPantalla }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const cambiarPassword = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/usuarios/cambiar-password", {
        usuarioId: usuario.id,
        passwordActual,
        nuevaPassword,
        confirmarPassword,
      });

      toast.success("Contraseña actualizada correctamente 🔐");

      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      toast.error(error.response?.data || "Error al cambiar contraseña");
    }
  };

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <Settings size={34} />
        </div>

        <div>
          <span>Panel del administrador</span>
          <h1>Configuración</h1>
          <p>Administra la seguridad y acceso del sistema.</p>
        </div>
      </div>

      <div className="productos-stats">
        <div className="mini-stat">
          <ShieldCheck />
          <div>
            <p>Usuario activo</p>
            <strong>{usuario?.nombreUsuario || "Admin"}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <Lock />
          <div>
            <p>Seguridad</p>
            <strong>Clave</strong>
          </div>
        </div>
      </div>

      <div className="productos-panel">
        <h2>Cambiar contraseña</h2>

        <form onSubmit={cambiarPassword}>
          <div className="form-grid">
            <div className="campo">
              <label>Contraseña actual</label>
              <input
                type="password"
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="Ingrese contraseña actual"
                required
              />
            </div>

            <div className="campo">
              <label>Nueva contraseña</label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Ingrese nueva contraseña"
                required
              />
            </div>

            <div className="campo">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repita la nueva contraseña"
                required
              />
            </div>
          </div>

          <button className="btn-primary" type="submit">
            <Lock size={18} />
            Guardar contraseña
          </button>
        </form>
      </div>
    </Layout>
  );
}