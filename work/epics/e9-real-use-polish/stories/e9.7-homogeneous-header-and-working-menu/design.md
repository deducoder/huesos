# Story e9.7: Homogeneous header, and a menu that opens — Design

> Complexity: complex

## 1 · What & why

**Problem:** la cabecera de la ficha es una barra plana, distinta de todas
las demás cajas de la interfaz; y el botón de menú es un `<div
aria-hidden="true">` que no hace nada — la aplicación no cumple la
atribución literal que su modelo 3D exige, que hoy solo vive en el
repositorio.

**Value:** consistencia visual terminada, y un incumplimiento de licencia
real que deja de serlo.

## 2 · Approach

**Dos cambios independientes en el mismo archivo.** La cabecera de ficha
cambia de clases CSS, sin lógica nueva. El menú pasa de decorativo a un
botón real que abre un panel — **un overlay propio con `role="dialog"`,
no el elemento nativo `<dialog>`**: verificado contra jsdom 30.0.1 (la
versión que este proyecto fija), `HTMLDialogElement.prototype.showModal`
es `undefined`. Sin `showModal()`, `<dialog>` no atrapa el foco ni bloquea
el fondo — se comporta como un `<div>` cualquiera con un atributo `open`,
así que no aporta nada que un overlay propio no dé, y un overlay propio sí
se puede probar con Testing Library en vez de degradar a pruebas de código
fuente como las escenas 3D. Sin dependencia nueva: foco y `Escape` son
~30 líneas de React.

**El panel no toca `window.history` ni `Modo`.** Es estado local de `App`
(`menuAbierto: boolean`), independiente de `navegar()`/ADR-013 — abrir o
cerrar el panel no es una transición de modo, es una capa encima de la
vista actual.

**Components affected:**

- `src/App.tsx`: modify — cabecera de ficha redondeada; `MenuIcono` pasa a
  ser un botón real; nuevo estado `menuAbierto` y su apertura/cierre.
- `src/components/AboutPanel.tsx`: create — el overlay con atribución,
  licencia, privacidad y advertencia de exactitud.
- `src/components/AboutPanel.test.tsx`: create — comportamiento real
  (Testing Library), no código fuente: el foco y el cierre se pueden
  probar de verdad, a diferencia de las escenas WebGL.

**Legacy sweep:** `IconoCuadrado` se sigue usando para el logo (decorativo,
sin cambios) y ahora también envuelve el `<svg>` del menú **dentro** de un
`<button>`, en vez de ser el elemento interactivo él mismo — no queda
código muerto, cambia de rol dentro del mismo componente. Nada se borra.

## 3 · Interface / examples

### Usage

```tsx
// src/App.tsx
const [menuAbierto, setMenuAbierto] = useState(false)
// …
<button
  type="button"
  aria-haspopup="dialog"
  onClick={() => setMenuAbierto(true)}
  className="flex h-tactil w-tactil flex-none shrink-0 items-center justify-center self-center rounded-suave border-2 border-tinta bg-panel text-tinta shadow-dura"
>
  <MenuSvg />
  <span className="sr-only">Menú: privacidad, licencia y créditos del modelo</span>
</button>
{menuAbierto && <AboutPanel onClose={() => setMenuAbierto(false)} />}
```

```tsx
// src/components/AboutPanel.tsx
export function AboutPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
    const alTeclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', alTeclado)
    return () => document.removeEventListener('keydown', alTeclado)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/40 md:items-center">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-panel-titulo"
        tabIndex={-1}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel p-5 shadow-dura"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="about-panel-titulo" className="font-display font-semibold text-lg">
            Privacidad y créditos
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="…">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        {/* privacidad, atribución literal, licencia, advertencia de exactitud */}
      </div>
    </div>
  )
}
```

### Expected output

Contenido del panel, con el texto exacto (RF-09/`must-privacy-006`, y la
fórmula literal de `ATTRIBUTION.md`):

```
Privacidad
Tu progreso —qué acertaste y qué fallaste— se guarda solo en este
navegador. No hay cuenta, no hay servidor, no sale de tu teléfono.

Modelo 3D
BodyParts3D, © The Database Center for Life Science licensed under
CC Attribution-Share Alike 2.1 Japan
Publicado bajo licencia Creative Commons BY-SA 4.0. [enlace]

Los autores del modelo no garantizan su exactitud anatómica.
```

La fórmula de atribución va **exacta**, carácter por carácter contra
`ATTRIBUTION.md` — se importa como constante desde un módulo compartido en
vez de transcribirse a mano una segunda vez, para que las dos no puedan
desincronizarse.

### Key data structures

```ts
// src/data/attribution.ts — extraído de ATTRIBUTION.md a una constante
// que la interfaz puede importar; el .md sigue siendo la fuente legible
// para quien abre el repositorio, esto es lo mismo dato en TypeScript.
export const ATRIBUCION_LITERAL =
  'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan'
export const LICENCIA_URL = 'https://creativecommons.org/licenses/by-sa/4.0/'
```

## 4 · Acceptance criteria

- **Must:**
  1. La cabecera de la ficha usa `rounded-suave border-2 shadow-dura`,
     igual que las demás cajas flotantes.
  2. El botón de menú es un `<button>` real, con nombre accesible, y abre
     `AboutPanel`.
  3. `AboutPanel` muestra la fórmula literal de `ATRIBUCION_LITERAL`
     exacta, la licencia con enlace, el aviso de privacidad y la
     advertencia de exactitud.
  4. Cerrar el panel (botón, o `Escape`) no cambia `window.location`,
     `window.history.length`, ni el `Modo` de `App`.
  5. Al abrir, el foco entra al panel; al cerrar, vuelve al botón que lo
     abrió.
- **Should:**
  1. El fondo (`bg-tinta/40`) se puede tocar para cerrar, como
     complemento al botón — sin ser el único cierre.
- **Must NOT:**
  1. La fórmula de atribución no se traduce ni se resume.
  2. El panel no aparece en modo `'ficha'` (scope) — su salida es "←
     Volver", y la razón para no duplicar el menú ahí es que ninguno de
     los nueve puntos observados lo pide, y añadirlo exige rehacer el
     layout de esa cabecera, que ya tiene su propio cambio esta historia.
  3. Ninguna petición de red nueva (`must-privacy-006`): el enlace a la
     licencia es navegación del usuario, no una llamada de la aplicación.

### Scenarios (delta over the scope)

```gherkin
# CORREGIDO — el scope proponía `<dialog>` implícitamente ("nativo <dialog>
# vs overlay propio" quedaba abierto); el gemba descartó `<dialog>` con un
# hecho verificable, no una preferencia.
Given jsdom 30.0.1, la versión que este proyecto fija
When se llama `HTMLDialogElement.prototype.showModal`
Then es `undefined` — por eso el panel es un overlay propio con
     `role="dialog"`, probado con Testing Library de verdad

# AÑADIDO — foco y teclado no estaban en la lista de escenarios del scope.
Given el panel de menú cerrado
When lo abro con el teclado (Enter sobre el botón de menú)
Then el foco entra al panel sin necesitar el mouse
And `Escape` lo cierra y devuelve el foco al botón de menú
```

## 5 · Governance

- `must-privacy-006`/RF-09 fija el texto de privacidad: solo puede decir
  lo que el guardrail ya garantiza, ni más ni menos.
- `must-a11y-005` exige alcance por teclado y nombre accesible — el
  overlay propio lo cumple con foco gestionado a mano, verificable.
- La licencia CC BY-SA 4.0 (ver `ATTRIBUTION.md`) exige la fórmula
  literal; esta historia la muestra, no la reinterpreta.
