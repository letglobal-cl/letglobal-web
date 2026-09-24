# Publicar el sitio de Let Global

## 1. Crear el repositorio
1. Crea una cuenta gratuita en https://github.com
2. Botón **New repository** → nombre `letglobal-web` → **Public** → **Create repository**.
3. En el repositorio: **Add file → Upload files**, arrastra TODO el contenido de esta carpeta
   (incluida la carpeta `.github`; si el navegador la oculta, súbela desde GitHub Desktop) → **Commit changes**.

## 2. Activar la publicación
1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **Actions → "Actualizar indicadores y publicar sitio" → Run workflow**.
3. En 1–2 minutos queda en `https://TU-USUARIO.github.io/letglobal-web/`.

Desde ese momento el sitio se revisa solo todos los días: toma la UF del último día del mes
y la UTM del mes desde mindicador.cl (datos del Banco Central) y vuelve a publicarse.
Mientras la UF de fin de mes no se publica (antes del día 10 aprox.), la calculadora
usa la última disponible y lo indica como "UF provisoria".

## 3. Conectar el dominio .cl (cuando lo compres en nic.cl)
1. GitHub: **Settings → Pages → Custom domain** → escribe `www.tudominio.cl` → Save → marca **Enforce HTTPS**.
2. NIC Chile, en la gestión del dominio, configura los DNS (o usa el DNS de Cloudflare, gratis):
   - Registro `CNAME` para `www` → `TU-USUARIO.github.io`
   - Registros `A` para el dominio raíz → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. La propagación puede tardar algunas horas.

## 4. Lo que se actualiza a mano (pocas veces al año)
Edita `datos/parametros.json` en GitHub (ícono del lápiz → Commit) cuando cambie:
- **Ingreso mínimo**: agrega una fila nueva con su mes `desde`.
- **Cotización del empleador Ley 21.735**: cada agosto, nueva fila con la tasa.
- **Comisiones AFP**: cuando la Superintendencia de Pensiones informe cambios.
- **Topes imponibles en UF**: cada año (febrero).
- **Asignación familiar**: cuando cambien montos o tramos.
Al guardar, el sitio se vuelve a publicar solo.

## Archivos
- `index.html` – página de inicio
- `calculadora.html` – calculadora de remuneraciones
- `datos/indicadores.json` – UF y UTM (lo actualiza el robot)
- `datos/parametros.json` – parámetros de actualización manual
- `scripts/actualizar-indicadores.mjs` y `.github/workflows/` – la actualización automática
