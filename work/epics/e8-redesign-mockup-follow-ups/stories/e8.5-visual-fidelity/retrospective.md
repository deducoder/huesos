# Story e8.5: Visual fidelity — Retrospective

Estimated: sin estimación (historia informal, abierta a demanda) · Actual: 18 commits
en dos sesiones.

## Summary

La aplicación pasó de "reutiliza los tokens de e7" a "se parece al mockup":
navbar como píldora con color por pestaña, un color por región
(`REGION_ACCENT`) en la tarjeta de identidad y en Fichas, lienzo 3D en el
`#20242b` real del mockup, pantalla de test con tarjeta de respuesta flotante
y "← cambiar modo", y —en la segunda sesión— la ficha completa reconstruida
contra `refs/mock-ficha-completa.png`: cabecera con solo "← Volver", tarjeta
flotante abajo con las mismas medidas que la de Explorar, filas
etiqueta/valor con las etiquetas escritas a la vista, y dos campos nuevos
(`articulatesWith`, `clinicalNote`).

Sin ciclo RED-GREEN por cambio de CSS —decisión explícita del usuario para
esta historia—, pero con `./scripts/check` verde antes de cada commit y con
test propio (`BoneSheet.test.tsx`) para lo único que no era CSS: el
renderizado condicional de los campos nuevos.

## What went well

- **El navegador real encontró lo que ningún test unitario podía.** La navbar
  flotante rompía el raycasting de clics del lienzo: la grilla de 12x12 clics
  alcanzaba 8 huesos en `main` y 1 con el header flotante. La suite completa
  de integración fue el único instrumento que lo vio.
- **Comparar capturas contra el mockup, no leer el mockup.** Los cuatro puntos
  del alcance salieron de mirar `refs/mock-explorar.png` al lado de una
  captura propia, no de leer `refs/huesos-mono-ui.html`. Cuando sí hizo falta
  el HTML fue para los valores exactos (`#20242b`, `REGION_STYLES`), no para
  el juicio.
- **El caso extremo se probó antes de aceptarlo.** El alto fijo de la tarjeta
  de identidad se calibró contra el hueso más alto del catálogo (hioides,
  412px) y aun así el usuario lo rechazó por los casos cortos: se revirtió a
  alto dinámico en el commit siguiente.
- **Preguntar antes de inventar contenido.** «Articula con» y «Dato clínico»
  existían para 4 huesos en el mockup y para ninguno en el dominio. Se
  preguntó en vez de rellenar 202 fichas con anatomía inventada.

## What to improve

- **El sistema de color de esta historia vive fuera de `@theme`.**
  `REGION_ACCENT` (20 valores) y `ACENTO_PESTANIA` (3) son colores escritos a
  mano en TypeScript y aplicados con `style={{}}`. ADR-007 declara que los
  tokens de `@theme` son la única fuente del aspecto; `design-tokens.test.ts`
  solo vigila la paleta de fábrica de Tailwind, así que no lo ve. Es el mismo
  agujero que epic-review de E7 encontró con el color del 3D. **Destino:
  epic-review de E8** — o un ADR que acepte "color por región" como dato de
  vista legítimo, o migrarlo a `@theme`.
- **Dos de los tres acentos de pestaña duplican valores de `REGION_ACCENT`**
  (`explorar` = `thorax.bg`, `test-elegir` = `upper-limb.bg`) y el tercero
  (`fichas`, `#e4c64f`) no corresponde a ninguna región. Ajustar el naranja de
  `thorax` dejaría la pestaña "Explorar" con el valor viejo y nada avisaría.
  **Destino: la misma decisión.**
- **`onCambiarModo?` es opcional y su ausencia es silenciosa.** Los dos
  llamadores la pasan; un tercero que la olvide se queda sin el botón y
  ningún test lo nota. **Destino: hacerla requerida** (una línea por
  llamador), parqueado para después del cierre de la épica.
- **La ceremonia informal escondió un defecto por doce commits.** El texto de
  «este hueso no está en el modelo 3D» se dibujaba en `text-tinta` sobre el
  lienzo oscuro —ilegible— y solo apareció al capturar el caso del martillo en
  la segunda sesión. Un `progress.md` no lo habría encontrado, pero una lista
  de casos a capturar sí.

## Punto del alcance que no se hizo

`note.md` listaba cuatro puntos; tres se resolvieron. **La tipografía display
(Fredoka → Baloo 2) nunca se evaluó**: sigue Fredoka, y ADR-008 —que rechazó
Baloo 2 antes de que el mockup existiera— sigue vigente sin revisar. Es el
único de los cuatro con un ADR detrás, así que cambiarlo exige un ADR que lo
supersede, no un commit de CSS. Queda abierto y explícito.

Sobre el otro cierre que `note.md` pedía: `--color-lienzo` pasó de `#4a4640` a
`#20242b`. **No hace falta un ADR nuevo** — el valor original era una decisión
de historia (e7.2), no un ADR, y el comentario de `index.css` ya registra el
cambio y la re-verificación del resaltado contra el fondo nuevo.

## Learned

1. **About the system:** un mockup trae datos que el dominio no tiene, y no se
   nota hasta implementarlo. `articula` y `dato` parecían campos del modelo y
   eran cuatro ejemplos escritos a mano; el tipo `Bone` no los tenía y los
   otros 202 huesos siguen sin tenerlos. La estructura de un mockup se copia,
   su contenido se verifica.
2. **About the process:** el color del texto no viaja con su contenedor. Al
   mover un componente sobre una superficie de otro tema —`text-tinta` sobre
   `--color-lienzo`— queda ilegible sin que ningún test unitario ni el gate lo
   vean; solo una captura del caso concreto lo muestra.
3. **Capability gained:** una historia informal puede tener gates y tests
   igual — lo que se saltó fue el RED-GREEN por cambio de CSS, no la
   comprobación. Lo que sí faltó, y costó, fue la lista de casos a capturar:
   la ficha del hueso *sin* geometría era uno de ellos y tardó doce commits en
   mirarse.
