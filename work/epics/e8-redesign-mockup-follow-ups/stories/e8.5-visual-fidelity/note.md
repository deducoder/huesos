# Story e8.5: Visual fidelity — Note

**Informal.** El usuario pidió explícitamente iterar en una rama de
historia sin el ciclo completo (sin `scope.md`/`design.md`/`plan.md`
TDD por tarea) hasta lograr el resultado visual que quiere, comparando
contra el mockup real en cada paso. Este archivo reemplaza la ceremonia
habitual — registra el porqué y el alcance, no tareas ni criterios de
aceptación formales.

## Por qué

`e8.1`-`e8.4` reutilizaron el sistema de diseño existente (tokens de
e7/ADR-007/ADR-008) sin comparar sus valores contra el mockup real
(`refs/huesos-mono-ui.html`) elemento por elemento. Al comparar capturas
reales (`refs/mock-explorar.png` vs `refs/actual-explorar.png`) la
diferencia es visible, no solo en los recortes de alcance que `e8.1`
documentó (sin menú, sin flotante) sino en la paleta completa.

## Alcance (decidido por el usuario)

**Navbar + paleta completa:**
- Navbar: píldora agrupada para las 3 pestañas, logo (ícono), menú
  (ícono) — como el mockup, revisando los recortes que `e8.1` hizo.
- Color de acento: azul (`#2f5fe0`) → evaluar el naranja/durazno del
  mockup (`accentHue` por defecto 265 en el mockup es azul-violeta, pero
  el estado activo de las pestañas usa un tono cálido — revisar la
  captura real, no el código del mockup a ciegas).
- Fondo del lienzo 3D: `#4a4640` (e7.2, probado contra el modelo) →
  `#20242b` en el mockup — ver si el contraste contra el hueso se
  sostiene antes de cambiarlo (e7.2 lo midió por una razón).
- Tipografía display: Fredoka (ADR-008) → Baloo 2 (mockup) — ADR-008 la
  rechazó explícitamente antes de que el mockup existiera; revisar si
  esa razón sigue aplicando o si el mockup cambia el juicio.

## Método

Iterar: ajustar → construir → capturar con Playwright en un viewport
real → comparar visualmente contra `refs/mock-explorar.png` → repetir.
`./scripts/check` se corre igual antes de cada commit (lint/format/types
no se saltan), pero no hay ciclo RED-GREEN por cambio de CSS.

## Cierre

Cuando el usuario confirme que el resultado es el que quiere, esta
historia cierra con lo que realmente se decidió — incluyendo si
`--color-lienzo`/ADR-008 se re-abren con su propio ADR nuevo (una
decisión de e7 no se edita, se supersede).
