import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import api from "../services/api";
import { ShieldCheck, UserPlus, Pencil, Power, Users as UsersIcon } from "lucide-react";

const usuarioVacio = {
  id: 0,
  nombre: "",
  nombreUsuario: "",
  correo: "",
  password: "",
  rol: "Vendedor",
  activo: true,
  palabraClave: "",
};

export function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(usuarioVacio);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function cargarUsuarios() {
    const res = await api.get("/Usuarios");
    setUsuarios(res.data);
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const limpiarFormulario = () => {
    setUsuario(usuarioVacio);
    setEditando(false);
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!usuario.nombre || !usuario.nombreUsuario) {
      toast.error("Completa nombre y usuario.");
      return;
    }

    if (!editando && usuario.password.length < 4) {
      toast.error("La contraseña debe tener mínimo 4 caracteres.");
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        ...usuario,
        password: usuario.password.trim(),
      };

      if (editando) {
        await api.put(`/Usuarios/${usuario.id}`, payload);
        toast.success("Usuario actualizado correctamente");
      } else {
        await api.post("/Usuarios", payload);
        toast.success("Usuario creado correctamente");
      }

      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      toast.error(error.response?.data || "No se pudo guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  const editarUsuario = (item) => {
    setUsuario({
      id: item.id,
      nombre: item.nombre,
      nombreUsuario: item.nombreUsuario,
      correo: item.correo || "",
      password: "",
      rol: item.rol || "Vendedor",
      activo: item.activo,
      palabraClave: "",
    });
    setEditando(true);
  };

  const cambiarEstado = async (item) => {
    try {
      await api.patch(`/Usuarios/${item.id}/estado?activo=${!item.activo}`);
      toast.success(item.activo ? "Usuario desactivado" : "Usuario activado");
      cargarUsuarios();
    } catch (error) {
      toast.error(error.response?.data || "No se pudo cambiar el estado.");
    }
  };

  const administradores = usuarios.filter((u) => u.rol === "Administrador").length;
  const vendedores = usuarios.filter((u) => u.rol === "Vendedor").length;

  return (
    <>
      <div className="productos-stats">
        <div className="mini-stat">
          <ShieldCheck />
          <div>
            <p>Administradores</p>
            <strong>{administradores}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <UserPlus />
          <div>
            <p>Vendedores</p>
            <strong>{vendedores}</strong>
          </div>
        </div>
      </div>

      <div className="productos-panel">
        <h2>{editando ? "Editar usuario" : "Crear usuario"}</h2>

        <form onSubmit={guardarUsuario}>
          <div className="form-grid">
            <div className="campo">
              <label>Nombre completo</label>
              <input
                value={usuario.nombre}
                onChange={(e) =>
                  setUsuario({ ...usuario, nombre: e.target.value })
                }
              />
            </div>

            <div className="campo">
              <label>Usuario</label>
              <input
                value={usuario.nombreUsuario}
                onChange={(e) =>
                  setUsuario({ ...usuario, nombreUsuario: e.target.value })
                }
              />
            </div>

            <div className="campo">
              <label>Correo</label>
              <input
                type="email"
                value={usuario.correo}
                onChange={(e) =>
                  setUsuario({ ...usuario, correo: e.target.value })
                }
              />
            </div>

            <div className="campo">
              <label>{editando ? "Nueva contraseña opcional" : "Contraseña"}</label>
              <input
                type="password"
                value={usuario.password}
                onChange={(e) =>
                  setUsuario({ ...usuario, password: e.target.value })
                }
              />
            </div>

            <div className="campo">
              <label>Rol</label>
              <select
                value={usuario.rol}
                onChange={(e) =>
                  setUsuario({ ...usuario, rol: e.target.value })
                }
              >
                <option value="Vendedor">Vendedor</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="campo">
              <label>Estado</label>
              <select
                value={usuario.activo ? "true" : "false"}
                onChange={(e) =>
                  setUsuario({ ...usuario, activo: e.target.value === "true" })
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={guardando}>
            <UserPlus size={18} />
            {guardando ? "Guardando..." : editando ? "Actualizar" : "Crear"}
          </button>

          {editando && (
            <button
              className="btn-delete"
              type="button"
              onClick={limpiarFormulario}
              style={{ marginTop: "18px" }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="productos-panel">
        <h2>Usuarios registrados</h2>

        <table className="tabla productos-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.nombre}</strong>
                </td>
                <td>{item.nombreUsuario}</td>
                <td>{item.correo || "Sin correo"}</td>
                <td>
                  <span className={item.rol === "Administrador" ? "badge-success" : "badge-warning"}>
                    {item.rol}
                  </span>
                </td>
                <td>
                  <span className={item.activo ? "badge-success" : "badge-danger"}>
                    {item.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => editarUsuario(item)}>
                    <Pencil size={16} />
                  </button>

                  <button className="btn-delete" onClick={() => cambiarEstado(item)}>
                    <Power size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Usuarios({ setPantalla }) {
  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <UsersIcon size={34} />
        </div>

        <div>
          <span>Control de acceso</span>
          <h1>Usuarios</h1>
          <p>Administra vendedores, administradores y estados de acceso.</p>
        </div>
      </div>

      <UsuariosAdmin />
    </Layout>
  );
}

export default Usuarios;
