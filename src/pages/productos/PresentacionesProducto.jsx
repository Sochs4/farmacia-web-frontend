import { Plus, Trash2 } from "lucide-react";

function PresentacionesProducto({ presentaciones, setPresentaciones }) {
  const presentacionBase = {
    id: 0,
    nombre: "",
    factorConversion: 1,
    precioVenta: 0,
    activo: true,
  };

  const agregarPresentacion = () => {
    setPresentaciones([...(presentaciones || []), presentacionBase]);
  };

  const cambiarPresentacion = (index, campo, valor) => {
    const nuevas = [...(presentaciones || [])];

    nuevas[index] = {
      ...nuevas[index],
      [campo]: valor,
    };

    setPresentaciones(nuevas);
  };

  const eliminarPresentacion = (index) => {
    const nuevas = (presentaciones || []).filter((_, i) => i !== index);

    setPresentaciones(nuevas.length > 0 ? nuevas : [presentacionBase]);
  };

  return (
    <div style={{ marginTop: "25px" }}>
      <h2>Presentaciones de venta</h2>

      {(presentaciones || [presentacionBase]).map((pres, index) => (
        <div className="form-grid" key={index}>
          <div className="campo">
            <label>Presentación</label>

            <select
              value={pres.nombre || ""}
              onChange={(e) =>
                cambiarPresentacion(index, "nombre", e.target.value)
              }
            >
              <option value="">Seleccione</option>
              <option value="Unidad">Unidad</option>
              <option value="Blister">Blister</option>
              <option value="Caja">Caja</option>
              <option value="Ampolla">Ampolla</option>
              <option value="Inyección">Inyección</option>
              <option value="Frasco">Frasco</option>
              <option value="Sobre">Sobre</option>
              <option value="Tubo">Tubo</option>
              <option value="Bolsa">Bolsa</option>
            </select>
          </div>

          <div className="campo">
            <label>Unidades que descuenta</label>

            <input
              type="number"
              min="1"
              value={pres.factorConversion || 1}
              onChange={(e) =>
                cambiarPresentacion(
                  index,
                  "factorConversion",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="campo">
            <label>Precio venta</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={pres.precioVenta || 0}
              onChange={(e) =>
                cambiarPresentacion(
                  index,
                  "precioVenta",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="campo">
            <label>Acción</label>

            <button
              type="button"
              className="btn-delete"
              onClick={() => eliminarPresentacion(index)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn-primary"
        onClick={agregarPresentacion}
      >
        <Plus size={18} />
        Agregar presentación
      </button>
    </div>
  );
}

export default PresentacionesProducto;
