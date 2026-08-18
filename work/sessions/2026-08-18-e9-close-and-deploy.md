# Session 2026-08-18 — e9 close and deploy

## Done

- Cerrada la historia e9.7 (menú funcional, cabecera de ficha redondeada,
  atribución de BodyParts3D en la interfaz) — más dos hallazgos reales de
  su verificación manual (T6: el «atrás» del sistema no cerraba el panel;
  T7: crédito de desarrollo y leyenda de no-rastreo).
- Cerrada la épica E9 completa: `epic-review` (scope re-verificado ítem
  por ítem, quality-review sin hallazgos), `epic-close` (ADR-016,
  `docs.md`, tag `epic/e9-complete`), empujada a `origin/main` (116
  commits).
- Desplegada la aplicación por primera vez: Cloudflare Worker
  `bones-learning`, dominio propio `bones.deducoder.com`, mismo patrón
  que los otros sitios de `deducoder.com` (Workers static assets +
  Workers Custom Domain). Título de pestaña "Bones Learning"; el código
  interno sigue llamándose `huesos-mono` (decisión explícita: separar
  nombre público de identidad interna).
- Agregado un descargo de responsabilidad al panel de menú ("tal cual,
  sin garantías", no es asesoría médica, uso bajo propio riesgo, sin
  responsabilidad por daños) — a pedido explícito tras una consulta
  legal informal, con TDD y mutación forzada como el resto del panel.

## Decided

- **El nombre "Bones Learning" solo toca el deploy** (título de
  `index.html`, nombre del Worker, dominio) — **por qué:** cambiar el
  `h1` interno, `package.json` o la clave de `localStorage` no aporta
  nada visible y arriesga el progreso ya guardado de quien probó la app
  antes de este cambio, para cero beneficio real.
- **El descargo de responsabilidad se agregó directo a `main`, sin abrir
  una historia nueva** — **por qué:** es contenido puntual sobre un
  componente ya revisado (`AboutPanel`), del mismo tamaño que los ajustes
  de copy que e9.7 ya hizo directo; abrir `scope.md`/`design.md` para un
  párrafo habría sido desproporcionado.
- **El descargo no declara jurisdicción ni ley aplicable** — **por qué:**
  inventar un país sería peor que omitirlo; si el usuario quiere esa
  cláusula, hace falta que la nombre él, no que se adivine.

## Open

Ninguna.

## Next

Nada programado — E9 es la última épica planificada y el deploy ya está
en producción. Si se retoma, `session-start` debería confirmar contra el
repo si hay una épica nueva que arrancar o si el foco pasa a mantenimiento
del sitio ya en vivo.

## State

Branch `main` · work item in flight: none · tree: clean
