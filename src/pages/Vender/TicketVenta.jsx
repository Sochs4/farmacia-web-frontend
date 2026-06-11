import {
  CheckCircle,
  Printer,
  X,
} from "lucide-react";

function TicketVenta({
  mostrarPregunta,
  setMostrarPregunta,
  mostrarTicket,
  setMostrarTicket,
  ultimaVenta,
  setUltimaVenta,
  ticketRef,
  descargarPDF,
}) {
  return (
    <>
      {mostrarPregunta && ultimaVenta && (
        <div className="ticket-overlay">
          <div className="ticket-question">
            <CheckCircle size={60} />

            <h2>Venta realizada</h2>
            <p>¿Desea descargar ticket PDF?</p>

            <div className="ticket-question-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setMostrarPregunta(false);
                  setMostrarTicket(true);
                }}
              >
                <Printer size={18} />
                Ticket PDF
              </button>

              <button
                className="btn-delete"
                onClick={() => {
                  setMostrarPregunta(false);
                  setUltimaVenta(null);
                  alert("Venta realizada correctamente");
                }}
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarTicket && ultimaVenta && (
        <div className="ticket-overlay">
          <div className="ticket-modal">
            <div className="ticket-box" ref={ticketRef}>
              <h2>Farmacia 24 Horas</h2>

              <p>
                <strong>Cliente:</strong> {ultimaVenta.clienteNombre}
              </p>

              <p>
                <strong>Fecha:</strong> {new Date().toLocaleString()}
              </p>

              <hr />

              {ultimaVenta.productosVendidos.map((item) => (
                <div className="ticket-item" key={item.carritoKey}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <p>
                      {item.presentacionNombre} x {item.cantidad}
                    </p>
                    <p>
                      Q {Number(item.precioSeleccionado).toFixed(2)} c/u
                    </p>
                  </div>

                  <span>
                    Q {(item.precioSeleccionado * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr />

              <h3>TOTAL: Q {Number(ultimaVenta.total).toFixed(2)}</h3>

              <p className="ticket-msg">Gracias por su compra ❤️</p>
            </div>

            <div className="ticket-actions">
              <button className="btn-primary" onClick={descargarPDF}>
                <Printer size={18} />
                Descargar PDF
              </button>

              <button
                className="btn-delete"
                onClick={() => {
                  setMostrarTicket(false);
                  setUltimaVenta(null);
                }}
              >
                <X size={18} />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TicketVenta;