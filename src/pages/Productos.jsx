import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  Plus,
  PackageCheck,
  AlertTriangle,
  Pill,
} from "lucide-react";

import FormularioProducto from "./productos/FormularioProducto";
import PresentacionesProducto from "./productos/PresentacionesProducto";
import TablaProductos from "./productos/TablaProductos";

function Productos({ setPantalla }) {
  const productoVacio = {
    id: 0,
    nombre: "",
    categoria: "",
    unidadMedida: "",
    precioCompra: 0,
    precioVenta: 0,
    cantidadPresentaciones: "",
    contenidoCompra: 1,
    stock: 0,
    stockMinimo: 10,
    alertaStock: true,
    fechaVencimiento: "",
    activo: true,
  };

  const presentacionVacia = {
    id: 0,
    nombre: "Unidad",
    factorConversion: 1,
    precioVenta: 0,
    activo: true,
  };

  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(productoVacio);
  const [presentaciones, setPresentaciones] = useState([presentacionVacia]);
  const [editando, setEditando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  async function cargarProductos() {
    const res = await api.get("/Productos");
    setProductos(res.data);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const limpiarFormulario = () => {
    setProducto(productoVacio);
    setPresentaciones([presentacionVacia]);
    setEditando(false);
  };

  const guardarProducto = async () => {
    let productoId = producto.id;

    if (editando) {
      await api.put(`/Productos/${producto.id}`, producto);
    } else {
      const res = await api.post("/Productos", producto);
      productoId = res.data.id;
    }

    for (const pres of presentaciones) {
      if (pres.nombre.trim() !== "" && Number(pres.factorConversion) > 0) {
        const data = {
          productoId,
          nombre: pres.nombre,
          factorConversion: Number(pres.factorConversion),
          precioVenta: Number(pres.precioVenta),
          activo: true,
        };

        if (editando && pres.id && pres.id > 0) {
          await api.put(`/PresentacionesProducto/${pres.id}`, {
            ...data,
            id: pres.id,
          });
        } else {
          await api.post("/PresentacionesProducto", data);
        }
      }
    }

    limpiarFormulario();
    cargarProductos();
  };

  const editarProducto = async (p) => {
    setProducto({
      ...p,
      cantidadPresentaciones: "",
      contenidoCompra: p.contenidoCompra || 1,
      fechaVencimiento: p.fechaVencimiento?.substring(0, 10),
    });

    const res = await api.get(`/PresentacionesProducto/producto/${p.id}`);
    setPresentaciones(res.data.length > 0 ? res.data : [presentacionVacia]);

    setEditando(true);
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    await api.delete(`/Productos/${id}`);
    cargarProductos();
  };

  return (
    <Layout setPantalla={setPantalla}>
      <div className="page-header">
        <div className="page-icon">
          <Pill size={34} />
        </div>

        <div>
          <span>Gestión de inventario</span>
          <h1>Productos</h1>
          <p>Administra medicamentos, presentaciones, stock y ganancias.</p>
        </div>
      </div>

      <div className="productos-stats">
        <div className="mini-stat">
          <PackageCheck />
          <div>
            <p>Total productos</p>
            <strong>{productos.length}</strong>
          </div>
        </div>

        <div className="mini-stat alerta">
          <AlertTriangle />
          <div>
            <p>Bajo stock</p>
            <strong>
              {
                productos.filter(
                  (p) =>
                    p.alertaStock &&
                    p.stock > 0 &&
                    p.stock <= p.stockMinimo
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      <div className="productos-panel">
        <h2>{editando ? "Editar producto" : "Agregar producto"}</h2>

        <FormularioProducto
          producto={producto}
          setProducto={setProducto}
        />

        <PresentacionesProducto
          presentaciones={presentaciones}
          setPresentaciones={setPresentaciones}
        />

        <button className="btn-primary" onClick={guardarProducto}>
          <Plus size={18} />
          {editando ? "Actualizar" : "Guardar"}
        </button>

        {editando && (
          <button
            className="btn-delete"
            type="button"
            onClick={limpiarFormulario}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </div>

      <TablaProductos
        productos={productos}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtro={filtro}
        setFiltro={setFiltro}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />
    </Layout>
  );
}

export default Productos;
