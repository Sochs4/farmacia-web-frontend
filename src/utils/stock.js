export function calcularStockTotal(cantidadPresentaciones, contenidoPorPresentacion) {
  const cantidad = Number(cantidadPresentaciones) || 0;
  const contenido = Number(contenidoPorPresentacion) || 1;

  return cantidad * contenido;
}

export function formatearStockCompuesto(stockBase, presentaciones = [], unidadMinima = "Unidad") {
  let restante = Math.max(0, Number(stockBase) || 0);

  const opciones = [...(presentaciones || [])]
    .filter((p) => p?.activo !== false && Number(p?.factorConversion) > 0)
    .sort((a, b) => Number(b.factorConversion) - Number(a.factorConversion));

  const partes = [];

  for (const presentacion of opciones) {
    const factor = Number(presentacion.factorConversion) || 1;
    const cantidad = Math.floor(restante / factor);

    if (cantidad > 0) {
      partes.push(`${cantidad} ${presentacion.nombre}`);
      restante -= cantidad * factor;
    }
  }

  if (restante > 0) {
    partes.push(`${restante} ${unidadMinima || "Unidad"}`);
  }

  if (partes.length === 0) {
    return `0 ${unidadMinima || "Unidad"}`;
  }

  return partes.join(" y ");
}
