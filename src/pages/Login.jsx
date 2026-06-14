import { useState } from "react";
import api from "../services/api";
import { obtenerPantallaInicial } from "../utils/permisos";

import {
  User,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  Mail,
} from "lucide-react";

import logo from "../assets/logo.png";

function Login({ setPantalla }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [correo, setCorreo] = useState("");
  const [palabraClave, setPalabraClave] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const handleLogin = async () => {
    if (!usuario || !password) {
      setError("Debe completar todos los campos");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/Usuarios/login", {
        nombreUsuario: usuario,
        password: password,
      });

      localStorage.setItem("usuario", JSON.stringify(response.data));

      setError("");

      setTimeout(() => {
        setPantalla(obtenerPantallaInicial(response.data));
      }, 800);
    } catch {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const recuperarPassword = async () => {
    setError("");
    setMensaje("");

    if (!correo || !palabraClave || !nuevaPassword || !confirmarPassword) {
      setError("Debe completar todos los campos");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      await api.post("/Usuarios/recuperar-password", {
        correo,
        palabraClave,
        nuevaPassword,
        confirmarPassword,
      });

      setMensaje("Contraseña restablecida correctamente. Ya puede iniciar sesión.");

      setCorreo("");
      setPalabraClave("");
      setNuevaPassword("");
      setConfirmarPassword("");

      setTimeout(() => {
        setModoRecuperar(false);
        setMensaje("");
      }, 1200);
    } catch (error) {
      setError(error.response?.data || "No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-new">
      <div className="login-card-new">
        <section className="login-left">
          <div className="login-brand">
            <img src={logo} alt="Logo farmacia" className="login-logo" />
          </div>

          <p>
            Sistema moderno de ventas, inventario, reportes y control de
            vencimientos.
          </p>

          <span>Plataforma profesional para farmacia</span>
        </section>

        <section className="login-right">
          <h2>{modoRecuperar ? "Recuperar contraseña" : "Iniciar sesión"}</h2>

          <p>
            {modoRecuperar
              ? "Ingresa tu correo, palabra clave y nueva contraseña."
              : "Ingresa con tu usuario administrador."}
          </p>

          {!modoRecuperar ? (
            <>
              <div className="login-input">
                <User size={20} />

                <input
                  placeholder="Usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>

              <div className="login-input">
                <Lock size={20} />

                <input
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                >
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="login-input">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Correo del administrador"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="login-input">
                <KeyRound size={20} />
                <input
                  type="password"
                  placeholder="Palabra clave"
                  value={palabraClave}
                  onChange={(e) => setPalabraClave(e.target.value)}
                />
              </div>

              <div className="login-input">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                />
              </div>

              <div className="login-input">
                <Lock size={20} />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {error && <div className="login-error">{error}</div>}
          {mensaje && <div className="login-success">{mensaje}</div>}

          <button
            className="login-btn-new"
            onClick={modoRecuperar ? recuperarPassword : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Procesando...
              </>
            ) : modoRecuperar ? (
              <>
                <KeyRound size={20} />
                Restablecer contraseña
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar al sistema
              </>
            )}
          </button>

          <button
            type="button"
            className="forgot-btn"
            onClick={() => {
              setModoRecuperar(!modoRecuperar);
              setError("");
              setMensaje("");
            }}
          >
            {modoRecuperar ? "Volver al login" : "¿Olvidaste tu contraseña?"}
          </button>
        </section>
      </div>
    </div>
  );
}

export default Login;
