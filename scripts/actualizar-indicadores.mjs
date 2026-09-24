// Actualiza datos/indicadores.json con la UF (último día del mes) y la UTM
// del mes actual y del anterior, usando la API pública de mindicador.cl.
import fs from "node:fs/promises";

const ARCHIVO = new URL("../datos/indicadores.json", import.meta.url);
const pad = n => String(n).padStart(2, "0");
const ddmmyyyy = (y, m, d) => `${pad(d)}-${pad(m)}-${y}`;

async function consultar(ruta) {
  try {
    const r = await fetch(`https://mindicador.cl/api/${ruta}`, { headers: { "User-Agent": "letglobal-web" } });
    if (!r.ok) return null;
    const j = await r.json();
    const v = j?.serie?.[0]?.valor;
    return typeof v === "number" ? { valor: v, fecha: j.serie[0].fecha.slice(0, 10) } : null;
  } catch { return null; }
}

// Mes actual en hora de Chile
const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const [ya, ma] = hoy.split("-").map(Number);
const meses = [[ya, ma], ma === 1 ? [ya - 1, 12] : [ya, ma - 1]];

const datos = JSON.parse(await fs.readFile(ARCHIVO, "utf8"));
let cambios = false;

for (const [y, m] of meses) {
  const clave = `${y}-${pad(m)}`;
  const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const actual = datos.periodos[clave] || {};

  let uf = await consultar(`uf/${ddmmyyyy(y, m, ultimo)}`);
  let provisoria = false;
  if (!uf) { uf = await consultar("uf"); provisoria = true; }   // aún no publicada: se usa la última disponible
  const utm = await consultar(`utm/${ddmmyyyy(y, m, 1)}`);

  const nuevo = { ...actual };
  const ufValida = uf && uf.valor > 30000 && uf.valor < 80000;
  if (ufValida && !(provisoria && actual.UF && !actual.UF_provisoria)) {
    Object.assign(nuevo, { UF: uf.valor, UF_fecha: uf.fecha, UF_provisoria: provisoria });
  }
  if (utm && utm.valor > 50000 && utm.valor < 150000) nuevo.UTM = utm.valor;

  if (nuevo.UF && nuevo.UTM && JSON.stringify(nuevo) !== JSON.stringify(actual)) {
    datos.periodos[clave] = nuevo;
    cambios = true;
  }
}

// Conserva los últimos 6 meses
for (const k of Object.keys(datos.periodos).sort().slice(0, -6)) { delete datos.periodos[k]; cambios = true; }

if (cambios) {
  datos.actualizado = hoy;
  await fs.writeFile(ARCHIVO, JSON.stringify(datos, null, 2) + "\n");
  console.log("Indicadores actualizados:", JSON.stringify(datos.periodos));
} else {
  console.log("Sin cambios.");
}
