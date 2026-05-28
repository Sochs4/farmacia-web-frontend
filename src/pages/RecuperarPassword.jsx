import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function RecuperarPassword({ setPantalla }) {
  const [correo, setCorreo] = useState("");
  const [palabraClave, setPalabraClave] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const recuperarPassword = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/usuarios/recuperar-password", {
        correo,
        palabraClave,
        nuevaPassword,
        confirmarPassword,
      });

      toast.success("Contraseña restablecida correctamente 🔐");
      setPantalla("login");
    } catch (error) {
      toast.error(error.response?.data || "Error al recuperar contraseña");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Recuperar contraseña</h2>
        <p>Ingresa tu correo y palabra clave del dueño.</p>

        <form onSubmit={recuperarPassword}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Palabra clave"
            value={palabraClave}
            onChange={(e) => setPalabraClave(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
          />

          <button type="submit">Restablecer contraseña</button>

          <button type="button" onClick={() => setPantalla("login")}>
            Volver al login
          </button>
        </form>
      </div>
    </div>
  );
}