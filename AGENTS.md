# AGENTS.md

Guía para agentes de IA y personas que contribuyen a este repositorio.

## Proyecto

**Rick and Morty Explorer**: SPA que consume la [Rick and Morty API](https://rickandmortyapi.com/documentation)
para listar, buscar y filtrar personajes, y mostrar la ficha de cada uno con sus episodios.
Se publica en GitHub Pages: https://vichuge.github.io/ReactjsListAndInfo/

- React 19 + React Router 7 (`HashRouter`)
- Vite 8 (build) · Vitest 5 + Testing Library (tests) · ESLint 10 (flat config)
- CSS plano con variables (sin frameworks de UI ni CSS-in-JS)
- JavaScript (sin TypeScript), módulos ES, Node >= 20.19

## Comandos

```bash
npm ci            # instalar dependencias (usa package-lock.json)
npm run dev       # servidor de desarrollo → http://localhost:5173/ReactjsListAndInfo/
npm run lint      # ESLint; debe quedar sin errores ni warnings
npm test          # Vitest (una pasada)
npm run build     # build de producción en dist/
npm run preview   # sirve dist/ localmente
```

Antes de dar un cambio por terminado: `npm run lint && npm test && npm run build` deben pasar.
Es exactamente lo que ejecuta la CI.

## Estructura

```
index.html               Entrada de Vite (meta tags, fuentes, script anti-parpadeo del tema)
public/                  Archivos estáticos copiados tal cual (favicon, manifest, robots)
src/
  main.jsx               Monta <App> dentro de <HashRouter> y <StrictMode>
  App.jsx                Tabla de rutas
  api.js                 Cliente de la API: reintentos, caché en memoria, normalización
  components/            Componentes de UI reutilizables
  pages/                 Vistas por ruta: Home, CharacterDetail, NotFound
  hooks/                 useAsync (fetch con AbortController), useDebounce, useTheme
  utils/                 Funciones puras (p. ej. getPageItems de la paginación)
  styles/global.css      Todos los estilos; tokens de diseño en :root
  test/                  setup.js de Vitest y fixtures compartidas
  images/                Imágenes importadas desde el código (404.png)
.github/workflows/       CI y despliegue a GitHub Pages
```

Rutas: `/` (listado; estado en query params `page`, `name`, `status`, `gender`),
`/character/:id` (detalle) y `*` (404).

## Convenciones

- **Componentes funcionales y hooks**; nada de class components.
- **Textos de la UI en español.** Los datos de la API llegan en inglés; traduce solo los valores
  conocidos (estado, género, `unknown`) y deja tal cual los nombres propios.
- **El estado de navegación vive en la URL** (`useSearchParams`): página y filtros deben poder
  compartirse y funcionar con atrás/adelante. Cambiar un filtro reinicia a la página 1.
- **Peticiones a la API solo desde `src/api.js`**, consumidas con `useAsync(fn, deps)`, que cancela
  la petición anterior. No llames a `fetch` desde los componentes.
- **Estilos:** usa los tokens de `:root` (`--surface`, `--accent`, `--text-muted`…) en lugar de
  colores sueltos, y define todo color nuevo para los dos temas (`[data-theme='light']` y el bloque
  `prefers-color-scheme`). Ojo con la especificidad: las reglas base van más abajo en el archivo y
  pueden pisar a las de los media queries.
- **Accesibilidad:** imágenes con `alt` (vacío si son decorativas), controles con etiqueta,
  `aria-current` / `aria-checked` / `aria-busy` donde aplique, foco visible y respeto a
  `prefers-reduced-motion`.
- **ESLint:** las reglas de `react-hooks` v7 prohíben `setState` síncrono dentro de `useEffect`.
  Deriva el estado durante el render (ver `useAsync` y `Filters`) en vez de desactivar la regla.
- No agregues dependencias si una solución pequeña en el propio código basta.

## Particularidades de la API (importante)

- **Un filtro sin resultados responde `404`** `{"error":"There is nothing here"}`. `getCharacters`
  lo convierte en una página vacía; no lo trates como error.
- **Rate limit (Cloudflare):** responde `429` con `retry-after` y **sin cabeceras CORS**, así que en
  el navegador se ve como un `TypeError: Failed to fetch` y no como un 429. `api.js` reintenta con
  backoff y cachea las respuestas correctas; las imágenes de avatar también pueden fallar, y para
  eso `Avatar` muestra una silueta de respaldo.
- **`/episode/1,2,3` devuelve un arreglo, pero `/episode/1` devuelve un objeto.** `getEpisodes`
  lo normaliza.
- `/character/abc` no es un id válido; el detalle valida el id antes de llamar a la API.

## Tests

- Viven junto al código (`*.test.js[x]`). `fetch` se mockea con `vi.spyOn(globalThis, 'fetch')` y
  el helper `jsonResponse` de `src/test/fixtures.js`. **Nunca llames a la API real en los tests.**
- `setup.js` limpia el DOM, los mocks y la caché de la API después de cada test. En modo test los
  reintentos no esperan.
- Las pruebas de integración renderizan `<App>` dentro de `<MemoryRouter initialEntries={[...]}>`.
- Si arreglas un bug, agrega el test que lo habría detectado.

## Despliegue

- `.github/workflows/deploy.yml`: en los PR ejecuta lint, test y build; en push a `master`
  (o lanzándolo a mano) además publica `dist/` en GitHub Pages con `actions/deploy-pages`.
- La fuente de Pages en *Settings → Pages* es **GitHub Actions**. No uses la rama `gh-pages`
  ni el paquete `gh-pages`.
- `base: '/ReactjsListAndInfo/'` en `vite.config.js` debe coincidir con el nombre del repositorio.
  Se usa `HashRouter` porque GitHub Pages no reescribe las rutas del lado del cliente.
- `dist/` no se versiona.

## Git

- Rama principal: `master`. Trabaja en ramas y abre un PR; la CI debe estar en verde.
- Mensajes de commit en imperativo y concisos (p. ej. `Add gender filter`).
