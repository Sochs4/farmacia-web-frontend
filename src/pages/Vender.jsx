import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  CreditCard,
  Search,
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle,
  Printer,
  X,
} from "lucide-react";

function Vender({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("Cliente General");

  const [ultimaVenta, setUltimaVenta] = useState(null);

  const [mostrarPregunta, setMostrarPregunta] =
    useState(false);

  const [mostrarTicket, setMostrarTicket] =
    useState(false);

  const [busqueda, setBusqueda] = useState("");

  const ticketRef = useRef();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get("/Productos");

      setProductos(
        res.data.filter(
          (p) => p.activo && p.stock > 0
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      p.categoria
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const agregarCarrito = (producto) => {
    const existe = carrito.find(
      (item) => item.id === producto.id
    );

    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert("No hay más stock disponible.");
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        { ...producto, cantidad: 1 },
      ]);
    }
  };

  const cambiarCantidad = (id, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    const item = carrito.find(
      (p) => p.id === id
    );

    if (nuevaCantidad <= 0) return;

    if (
      item &&
      nuevaCantidad > item.stock
    ) {
      alert(
        "La cantidad supera el stock disponible."
      );

      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: nuevaCantidad,
            }
          : item
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(
      carrito.filter(
        (item) => item.id !== id
      )
    );
  };

  const total = carrito.reduce(
    (sum, item) =>
      sum +
      item.precioVenta * item.cantidad,
    0
  );

  const descargarPDF = async () => {
    const input = ticketRef.current;

    const canvas =
      await html2canvas(input);

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 140],
    });

    const imgWidth = 70;

    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      5,
      5,
      imgWidth,
      imgHeight
    );

    pdf.save("ticket-farmacia.pdf");
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      alert("Debe agregar productos.");

      return;
    }

    try {
      const venta = {
        clienteNombre,

        detalles: carrito.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      };

      const res = await api.post(
        "/Ventas/vender",
        venta
      );

      setUltimaVenta({
        ...res.data,
        productosVendidos: carrito,
      });

      setMostrarPregunta(true);

      setCarrito([]);

      setClienteNombre(
        "Cliente General"
      );

      cargarProductos();
    } catch (error) {
      console.log(error);

      alert(
        "Error al realizar la venta"
      );
    }
  };

  return (
    <Layout setPantalla={setPantalla}>
      <div className="ventas-header">
        <div className="header-icon">
          <CreditCard size={34} />
        </div>

        <div>
          <span>Punto de venta</span>

          <h1>Vender</h1>
        </div>
      </div>

      <div className="venta-layout">
        {/* PRODUCTOS */}
        <div className="panel">
          <div className="ventas-panel-title">
            <div>
              <h2>
                Productos disponibles
              </h2>

              <p>
                Selecciona los productos
                que el cliente desea
                comprar.
              </p>
            </div>

            <div className="search-box venta-search">
              <Search size={18} />

              <input
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="productos-grid">
            {productosFiltrados.map(
              (p) => (
                <div
                  className="producto-card"
                  key={p.id}
                >
                  <div className="producto-icon">
                    <Plus size={22} />
                  </div>

                  <h3>{p.nombre}</h3>

                  <p>{p.categoria}</p>

                  <p>
                    {p.unidadMedida}
                  </p>

                  <strong>
                    Q{" "}
                    {Number(
                      p.precioVenta
                    ).toFixed(2)}
                  </strong>

                  <span>
                    Stock: {p.stock}
                  </span>

                  <button
                    onClick={() =>
                      agregarCarrito(p)
                    }
                  >
                    <ShoppingCart
                      size={17}
                    />

                    Agregar
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* CARRITO */}
        <div className="panel carrito-panel">
          <h2>Carrito de venta</h2>

          <label>Cliente</label>

          <input
            value={clienteNombre}
            onChange={(e) =>
              setClienteNombre(
                e.target.value
              )
            }
          />

          {carrito.length === 0 && (
            <div className="carrito-vacio">
              <ShoppingCart
                size={34}
              />

              <p>
                No hay productos
                agregados.
              </p>
            </div>
          )}

          {carrito.map((item) => (
            <div
              className="carrito-item"
              key={item.id}
            >
              <div>
                <strong>
                  {item.nombre}
                </strong>

                <p>
                  Q{" "}
                  {Number(
                    item.precioVenta
                  ).toFixed(2)}
                </p>
              </div>

              <input
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  cambiarCantidad(
                    item.id,
                    e.target.value
                  )
                }
              />

              <span>
                Q{" "}
                {(
                  item.precioVenta *
                  item.cantidad
                ).toFixed(2)}
              </span>

              <button
                onClick={() =>
                  eliminarDelCarrito(
                    item.id
                  )
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="total-box">
            <p>Total a pagar</p>

            <h2>
              Q {total.toFixed(2)}
            </h2>
          </div>

          <button
            className="btn-primary venta-btn"
            onClick={finalizarVenta}
          >
            <CheckCircle size={18} />

            Finalizar venta
          </button>
        </div>
      </div>

      {/* PREGUNTA */}
      {mostrarPregunta &&
        ultimaVenta && (
          <div className="ticket-overlay">
            <div className="ticket-question">
              <CheckCircle
                size={60}
              />

              <h2>
                Venta realizada
              </h2>

              <p>
                ¿Desea descargar
                ticket PDF?
              </p>

              <div className="ticket-question-actions">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setMostrarPregunta(
                      false
                    );

                    setMostrarTicket(
                      true
                    );
                  }}
                >
                  <Printer
                    size={18}
                  />

                  Ticket PDF
                </button>

                <button
                  className="btn-delete"
                  onClick={() => {
                    setMostrarPregunta(
                      false
                    );

                    setUltimaVenta(
                      null
                    );

                    alert(
                      "Venta realizada correctamente"
                    );
                  }}
                >
                  No, gracias
                </button>
              </div>
            </div>
          </div>
        )}

      {/* TICKET */}
      {mostrarTicket &&
        ultimaVenta && (
          <div className="ticket-overlay">
            <div className="ticket-modal">
              <div
                className="ticket-box"
                ref={ticketRef}
              >
                <h2>
                  Farmacia 24 Horas
                </h2>

                <p>
                  <strong>
                    Cliente:
                  </strong>{" "}
                  {
                    ultimaVenta.clienteNombre
                  }
                </p>

                <p>
                  <strong>
                    Fecha:
                  </strong>{" "}
                  {new Date().toLocaleString()}
                </p>

                <hr />

                {ultimaVenta.productosVendidos.map(
                  (item) => (
                    <div
                      className="ticket-item"
                      key={item.id}
                    >
                      <div>
                        <strong>
                          {
                            item.nombre
                          }
                        </strong>

                        <p>
                          x
                          {
                            item.cantidad
                          }
                        </p>
                      </div>

                      <span>
                        Q{" "}
                        {(
                          item.precioVenta *
                          item.cantidad
                        ).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )
                )}

                <hr />

                <h3>
                  TOTAL: Q{" "}
                  {Number(
                    ultimaVenta.total
                  ).toFixed(2)}
                </h3>

                <p className="ticket-msg">
                  Gracias por su
                  compra ❤️
                </p>
              </div>

              <div className="ticket-actions">
                <button
                  className="btn-primary"
                  onClick={
                    descargarPDF
                  }
                >
                  <Printer
                    size={18}
                  />

                  Descargar PDF
                </button>

                <button
                  className="btn-delete"
                  onClick={() => {
                    setMostrarTicket(
                      false
                    );

                    setUltimaVenta(
                      null
                    );
                  }}
                >
                  <X size={18} />

                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  );
}

export default Vender;