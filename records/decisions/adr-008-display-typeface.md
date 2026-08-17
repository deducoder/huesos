---
type: adr
id: ADR-008
title: "Fredoka 600 como familia display, empaquetada en el propio origen"
status: accepted
date: 2026-08-17
epic: e7
---

# ADR-008: Fredoka 600 como familia display, empaquetada en el propio origen

## Status

Accepted

## Context

ADR-007 fijó la dirección visual de E7 y dejó dos decisiones abiertas a
propósito, «porque tomarlas ahora sería decidir sin ver». Esta es una de las
dos: **qué tipografía display**. El brief ya había decidido *que* se empaqueta
—`must-privacy-006` prohíbe toda petición de red en tiempo de ejecución, con
dos gates vigilándolo, así que Google Fonts está descartado por construcción—
y describía la familia buscada como «display muy pesada y redondeada en
títulos; sans normal en cuerpo», anclada a tres referencias del usuario.

Medido al abrir la historia: el proyecto **no declaraba ninguna tipografía**
—ni `font-family` en `src/index.css` ni en `index.html`—, así que usaba la pila
por defecto de Tailwind. El catálogo de 206 huesos emplea **72 caracteres
distintos**, y el único fuera de Latin-1 es `—` (U+2014).

Cinco candidatas de licencia OFL se descargaron y se renderizaron **con el texto
real de la aplicación** —«huesos-mono», «hueso cigomático izquierdo»,
«¿Qué hueso es?»— a 390 px de ancho, no con una muestra de laboratorio.

## Decision

**La familia display es Fredoka 600, servida como el subset `latin` de 16,4 KB
desde `public/fonts/`, y expuesta como el token `--font-display`.**

1. **Solo en títulos.** El cuerpo conserva la pila del sistema, que no cuesta
   ninguna descarga y se lee bien. El brief pide display en títulos, no en todo.
2. **Sin paso de subsetting.** Los `.woff2` de Google ya vienen partidos por
   subset y el bloque `latin` cubre los 72 caracteres del catálogo. Añadir
   `fontTools` para reproducir un recorte ya hecho sería andamiaje sin
   beneficio.
3. **Presupuesto declarado: 25 KB.** Es el orden de magnitud de las cinco
   candidatas medidas (13,5-18,6 KB); deja margen sin invitar a crecer.
4. **`font-display: swap`.** En la conexión lenta que esta épica quiere servir,
   texto legible con la fuente de reserva es preferible a texto invisible.

## Consequences

- Cambiar la familia después es una línea: el token es el único sitio que la
  nombra, igual que el color desde e7.1.
- La aplicación gana 16,4 KB en la primera carga. `should-perf-007` sigue sin
  medición hasta e7.10, que es donde este coste se juzga con datos.
- **El repertorio cubierto depende de dónde se aplica la familia.** El fuente
  usa `→`, `←` y `▸`, que **no** están en el subset `latin`; no importa porque
  viven en botones y navegación, que son cuerpo. Si algún día la display se
  aplicara ahí, aparecerían cuadros vacíos y `tests/typography.test.ts` **no lo
  vería**: comprueba el catálogo, no la interfaz entera.
- La licencia OFL exige distribuir su texto con el archivo; `public/fonts/OFL.txt`
  cumple eso y es una obligación permanente, no un detalle de esta historia.

## Alternatives considered

- **(A) Baloo 2 ExtraBold** (18,6 KB, OFL). Rechazada: más peso y más altura de
  x que Fredoka, muy redondeada, pero su registro se acerca a lo infantil para
  una herramienta de estudio de anatomía que se usa durante horas.
- **(B) Nunito Black** (16,7 KB, OFL). Rechazada: se lee como el bold de una
  familia de texto, no como una display. Cumple «pesada» y falla «display».
- **(C) Outfit Black** (13,5 KB, OFL). Rechazada pese a ser la más liviana:
  geométrica de terminación plana, se aleja del «muy redondeada» que el brief
  ancló a sus referencias.
- **(D) Bakbak One** (15,8 KB, OFL). Rechazada: condensada —lo que ayudaría con
  nombres largos en 390 px— pero es la menos redondeada de las cinco.
- **(E) Google Fonts por `<link>`.** Rechazada por construcción: viola
  `must-privacy-006`, que es un `must` con dos gates. No se evaluó como opción
  real; se nombra acá porque es la vía por defecto de la industria y conviene
  que quede escrito por qué no aplica.
- **(F) Subsetear a mano con `fontTools`.** Rechazada: el archivo distribuido ya
  está subseteado y cubre el catálogo. Instalar la herramienta añadiría una
  dependencia de desarrollo y un paso de build para no cambiar el resultado.
