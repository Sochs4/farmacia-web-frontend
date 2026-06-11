import { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  CreditCard,
  Search,
} from "lucide-react";

import ProductoVentaCard from "./ProductoVentaCard";
import CarritoVenta from "./CarritoVenta";
import TicketVenta from "./TicketVenta";

function Vender({ setPantalla }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("Cliente General");
  const [ultimaVenta, setUltimaVenta] = useState(null);
  const [mostrarPregunta, setMostrarPregunta] = useState(false);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [presentaciones, setPresentaciones] = useState({});

  const ticketRef = useRef();

  async function cargarProductos() {
    try {
      const res = await api.get("/Productos");
      const productosActivos = res.data.filter((p) => p.activo && p.stock > 0);

      setProductos(productosActivos);

      for (const producto of productosActivos) {
        try {
          const pres = await api.get(
            `/PresentacionesProducto/producto/${producto.id}`
          );

          setPresentaciones((prev) => ({
            ...prev,
            [producto.id]: pres.data,
          }));
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const nombre = p.nombre || "";
    const categoria = p.categoria || "";

    return (
      nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const agregarCarrito = (producto) => {
    const primeraPresentacion = presentaciones[producto.id]?.[0];

    const presentacionProductoId = primeraPresentacion?.id || null;
    const presentacionNombre =
      primeraPresentacion?.nombre || producto.unidadMedida || "Unidad";
    const precioSeleccionado =
      primeraPresentacion?.precioVenta || producto.precioVenta || 0;
    const factorConversion = primeraPresentacion?.factorConversion || 1;

    const carritoKey = `${producto.id}-${presentacionProductoId || "base"}`;

    const existe = carrito.find((item) => item.carritoKey === carritoKey);

    if (existe) {
      cambiarCantidad(carritoKey, existe.cantidad + 1);
      return;
    }

    if (factorConversion > producto.stock) {
      alert("No hay stock suficiente para esta presentación.");
      return;
    }

    setCarrito([
      ...carrito,
      {
        ...producto,
        carritoKey,
        cantidad: 1,
        presentacionProductoId,
        presentacionNombre,
        precioSeleccionado,
        factorConversion,
      },
    ]);
  };

  const cambiarPresentacion = (carritoKey, nuevaPresentacionId) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.carritoKey !== carritoKey) return item;

        const pres = presentaciones[item.id]?.find(
          (p) => p.id === Number(nuevaPresentacionId)
        );

        if (!pres) return item;

        const nuevaCantidadDescontar = item.cantidad * pres.factorConversion;

        if (nuevaCantidadDescontar > item.stock) {
          alert("No hay stock suficiente para esta presentación.");
          return item;
        }

        return {
          ...item,
          carritoKey: `${item.id}-${pres.id}`,
          presentacionProductoId: pres.id,
          presentacionNombre: pres.nombre,
          precioSeleccionado: pres.precioVenta,
          factorConversion: pres.factorConversion,
        };
      })
    );
  };

  const cambiarCantidad = (carritoKey, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    if (nuevaCantidad <= 0) return;

    const item = carrito.find((p) => p.carritoKey === carritoKey);

    if (item && nuevaCantidad * item.factorConversion > item.stock) {
      alert("La cantidad supera el stock disponible.");
      return;
    }

    setCarrito((prev) =>
      prev.map((item) =>
        item.carritoKey === carritoKey
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const eliminarDelCarrito = (carritoKey) => {
    setCarrito(carrito.filter((item) => item.carritoKey !== carritoKey));
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.precioSeleccionado * item.cantidad,
    0
  );

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
          presentacionProductoId: item.presentacionProductoId,
          cantidad: item.cantidad,
        })),
      };

      const res = await api.post("/Ventas/vender", venta);

      setUltimaVenta({
        ...res.data,
        productosVendidos: carrito,
      });

      setMostrarPregunta(true);
      setCarrito([]);
      setClienteNombre("Cliente General");
      cargarProductos();
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Error al realizar la venta");
    }
  };

  const descargarPDF = async () => {
    const input = ticketRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 140],
    });

    const imgWidth = 70;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 5, 5, imgWidth, imgHeight);
    pdf.save("ticket-farmacia.pdf");
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
        <div className="panel">
          <div className="ventas-panel-title">
            <div>
              <h2>Productos disponibles</h2>
              <p>Selecciona productos y luego ajusta presentación en carrito.</p>
            </div>

            <div className="search-box venta-search">
              <Search size={18} />
              <input
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="productos-grid">
            {productosFiltrados.map((p) => (
              <ProductoVentaCard
                key={p.id}
                producto={p}
                presentaciones={presentaciones[p.id] || []}
                agregarCarrito={agregarCarrito}
              />
            ))}
          </div>
        </div>

        <CarritoVenta
          carrito={carrito}
          clienteNombre={clienteNombre}
          setClienteNombre={setClienteNombre}
          presentaciones={presentaciones}
          cambiarPresentacion={cambiarPresentacion}
          cambiarCantidad={cambiarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          total={total}
          finalizarVenta={finalizarVenta}
        />
      </div>

      <TicketVenta
        mostrarPregunta={mostrarPregunta}
        setMostrarPregunta={setMostrarPregunta}
        mostrarTicket={mostrarTicket}
        setMostrarTicket={setMostrarTicket}
        ultimaVenta={ultimaVenta}
        setUltimaVenta={setUltimaVenta}
        ticketRef={ticketRef}
        descargarPDF={descargarPDF}
      />
    </Layout>
  );
}

export default Vender;
