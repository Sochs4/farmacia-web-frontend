export const ROLES = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
};

export const PANTALLA_INICIAL_POR_ROL = {
  [ROLES.ADMIN]: "dashboard",
  [ROLES.VENDEDOR]: "vender",
};

const PERMISOS = {
  [ROLES.ADMIN]: [
    "dashboard",
    "productos",
    "compras",
    "vender",
    "inventario",
    "vencimientos",
    "reportes",
    "configuracion",
  ],
  [ROLES.VENDEDOR]: [
    "dashboard",
    "vender",
    "inventario",
    "vencimientos",
    "reportes",
    "configuracion",
  ],
};

export function obtenerUsuarioActual() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

export function esAdmin(usuario) {
  return usuario?.rol === ROLES.ADMIN;
}

export function obtenerPantallaInicial(usuario) {
  return PANTALLA_INICIAL_POR_ROL[usuario?.rol] || "login";
}

export function puedeVerPantalla(usuario, pantalla) {
  if (pantalla === "login") return true;

  return PERMISOS[usuario?.rol]?.includes(pantalla) || false;
}
