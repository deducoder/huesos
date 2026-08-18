import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { AboutPanel } from './components/AboutPanel'
import { FichasAccordion } from './components/FichasAccordion'
import { REGION_ACCENT } from './components/region-accent'
import { catalog } from './data/catalog'
import { type SelectionId, toggleSelection } from './domain/selection'
import { BoneDetailView } from './features/bone-detail/BoneDetailView'
import { ExploreView } from './features/explore/ExploreView'
import { BoneTestView } from './features/test/BoneTestView'
import { SkeletonTestView } from './features/test/SkeletonTestView'

/**
 * Qué vista está montada, sin router (ADR-003): la aplicación no necesita
 * enlaces profundos por hueso todavía, y esto evita una dependencia nueva.
 *
 * A dónde vuelve "Volver" desde una ficha no es un campo del modo sino la
 * entrada anterior del historial (ADR-013): a `'ficha'` solo se llega
 * empujando desde `'explorar'` o desde `'fichas'`, así que retroceder acierta
 * el origen por construcción.
 *
 * `'test-elegir'` es la pestaña "Test" antes de elegir variante (e4.5);
 * `'test-esqueleto'`/`'test-hueso'` montan `RF-04`/`RF-05` respectivamente.
 */
type Modo =
  | { tipo: 'explorar' }
  | { tipo: 'fichas' }
  | { tipo: 'ficha'; boneId: string }
  | { tipo: 'test-elegir' }
  | { tipo: 'test-esqueleto' }
  | { tipo: 'test-hueso' }

/**
 * El modo de arranque. Es una función y no una constante de módulo: un
 * objeto compartido devuelto como estado inicial convierte en global y
 * permanente cualquier mutación que un consumidor le haga.
 */
function modoInicial(): Modo {
  return { tipo: 'explorar' }
}

/** Los modos que no llevan más dato que su propio nombre. */
type ModoSinDatos = Exclude<Modo, { tipo: 'ficha' }>['tipo']

/**
 * Un `Record` sobre la unión y no una lista: si `Modo` gana una variante sin
 * dato y nadie la agrega acá, **falta una clave y el compilador lo dice**.
 * Una lista de cadenas aceptaría la omisión en silencio, que es el problema
 * conocido de un validador que re-codifica a mano la forma de su tipo.
 */
const MODOS_SIN_DATOS: Record<ModoSinDatos, true> = {
  explorar: true,
  fichas: true,
  'test-elegir': true,
  'test-esqueleto': true,
  'test-hueso': true,
}

/**
 * Valida lo que llega en `popstate`.
 *
 * `PopStateEvent.state` es `any` por definición del DOM y `must-type-004`
 * prohíbe `as` para silenciarlo, así que la forma se comprueba en tiempo de
 * ejecución — mismo patrón que `esProgresoDeHueso` aplica en
 * `src/storage/progress-store.ts` a lo que viene de `localStorage`.
 *
 * Una entrada ajena —otra aplicación del mismo origen, o una versión
 * anterior de esta tras un despliegue— no es un error: se cae al modo de
 * arranque, igual que ante una recarga, en vez de dejar la vista
 * desincronizada de la entrada del historial.
 */
function esModo(valor: unknown): valor is Modo {
  if (typeof valor !== 'object' || valor === null || !('tipo' in valor)) return false
  const { tipo } = valor
  if (typeof tipo !== 'string') return false
  if (tipo === 'ficha') return 'boneId' in valor && typeof valor.boneId === 'string'
  return Object.hasOwn(MODOS_SIN_DATOS, tipo)
}

const PESTANIAS = ['explorar', 'fichas', 'test-elegir'] as const
type Pestania = (typeof PESTANIAS)[number]

/**
 * e8.5 (iteración informal de fidelidad visual): cada pestaña activa toma
 * el color de una región distinta del mockup — no el acento único de la
 * app — valores extraídos del bundle real (`refs/huesos-mono-ui.html`),
 * no adivinados.
 */
const ACENTO_PESTANIA: Record<Pestania, string> = {
  explorar: '#ffac6e',
  fichas: '#e4c64f',
  'test-elegir': '#89da9b',
}

/**
 * Las pestañas de nivel superior, agrupadas en una sola píldora (e8.5).
 * En modo `'ficha'` la cabecera entera es otra y no las monta: no hay nada
 * que elegir mientras se está viendo una, "Volver" ya cubre esa salida.
 */
function Pestanas({ modo, onCambiar }: { modo: Modo; onCambiar: (tipo: Pestania) => void }) {
  const activa = (pestania: Pestania) =>
    modo.tipo === pestania || (pestania === 'test-elegir' && modo.tipo.startsWith('test-'))
  const etiqueta: Record<Pestania, string> = {
    explorar: 'Explorar',
    fichas: 'Fichas',
    'test-elegir': 'Test',
  }

  return (
    <nav
      className="flex items-center gap-[3px] rounded-suave border-2 border-tinta bg-panel p-1 shadow-dura"
      aria-label="Modo de estudio"
    >
      {PESTANIAS.map((pestania) => {
        const on = activa(pestania)
        return (
          <button
            key={pestania}
            type="button"
            onClick={() => onCambiar(pestania)}
            style={on ? { backgroundColor: ACENTO_PESTANIA[pestania] } : undefined}
            className={`min-h-tactil w-20 rounded-[10px] px-1 text-center font-semibold text-sm transition-colors duration-base ease-salida ${
              on ? 'text-tinta' : 'bg-transparent text-tinta-suave'
            }`}
          >
            {etiqueta[pestania]}
          </button>
        )
      })}
    </nav>
  )
}

/**
 * El cuadrado flotante del logo, borde y sombra — decorativo, `aria-hidden`.
 * El menú ya no lo usa (e9.7): tiene destino propio y es su propio
 * `<button>`, con el mismo aspecto pero accesible por teclado.
 */
function IconoCuadrado({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-tactil w-tactil flex-none shrink-0 items-center justify-center self-center rounded-suave border-2 border-tinta bg-panel text-tinta shadow-dura"
    >
      {children}
    </div>
  )
}

function LogoIcono() {
  return (
    <IconoCuadrado>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="3" fill="currentColor" />
        <circle cx="6" cy="6" r="4" fill="currentColor" />
        <circle cx="18" cy="6" r="4" fill="currentColor" />
        <circle cx="6" cy="18" r="4" fill="currentColor" />
        <circle cx="18" cy="18" r="4" fill="currentColor" />
      </svg>
    </IconoCuadrado>
  )
}

/**
 * A diferencia de `LogoIcono`, este sí tiene destino (e9.7): abre
 * `AboutPanel`. Mismo cuadrado flotante que el resto de los íconos de la
 * cabecera, pero un `<button>` real en vez de un `<div aria-hidden>`.
 */
function MenuIcono({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Menú: privacidad y créditos"
      className="flex h-tactil w-tactil flex-none shrink-0 items-center justify-center self-center rounded-suave border-2 border-tinta bg-panel text-tinta shadow-dura"
    >
      <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
        <rect width="18" height="2.6" rx="1.3" fill="currentColor" />
        <rect y="5.7" width="18" height="2.6" rx="1.3" fill="currentColor" />
        <rect y="11.4" width="18" height="2.6" rx="1.3" fill="currentColor" />
      </svg>
    </button>
  )
}

/** El ícono de "esqueleto completo": una figura de palito. */
function IconoEsqueletoCompleto() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="3.2" fill="currentColor" />
      <rect x="9" y="9" width="6" height="9" rx="2.5" fill="currentColor" />
      <rect
        x="3"
        y="10"
        width="5"
        height="2.6"
        rx="1.3"
        fill="currentColor"
        transform="rotate(-20 3 10)"
      />
      <rect
        x="16"
        y="10"
        width="5"
        height="2.6"
        rx="1.3"
        fill="currentColor"
        transform="rotate(20 16 10)"
      />
      <rect x="9" y="17" width="2.6" height="6" rx="1.3" fill="currentColor" />
      <rect x="12.4" y="17" width="2.6" height="6" rx="1.3" fill="currentColor" />
    </svg>
  )
}

/** El ícono de "hueso aislado": el mismo motivo que el logo, más chico. */
function IconoHuesoAislado() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="9" width="10" height="6" rx="3" fill="currentColor" />
      <circle cx="6" cy="6" r="3.2" fill="currentColor" />
      <circle cx="18" cy="6" r="3.2" fill="currentColor" />
      <circle cx="6" cy="18" r="3.2" fill="currentColor" />
      <circle cx="18" cy="18" r="3.2" fill="currentColor" />
    </svg>
  )
}

function TarjetaVariante({
  icono,
  iconoBg,
  titulo,
  descripcion,
  onClick,
}: {
  icono: ReactNode
  iconoBg: string
  titulo: string
  descripcion: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-suave border-2 border-tinta bg-panel p-4 text-left shadow-dura hover:bg-acento-suave"
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 flex-none items-center justify-center rounded-suave border-2 border-tinta text-tinta"
        style={{ backgroundColor: iconoBg }}
      >
        {icono}
      </span>
      <span>
        <span className="block font-display font-semibold text-tinta">{titulo}</span>
        <span className="mt-0.5 block text-tinta-suave text-sm">{descripcion}</span>
      </span>
    </button>
  )
}

/** La elección de variante antes de empezar a preguntar (`RF-04` vs `RF-05`). */
function ElegirVarianteDeTest({
  onElegir,
}: {
  onElegir: (variante: 'test-esqueleto' | 'test-hueso') => void
}) {
  return (
    <div className="flex h-full flex-col gap-3 px-4 pt-4">
      <p className="mb-1 font-display font-semibold text-tinta">
        ¿Sobre qué querés que te pregunte?
      </p>
      <TarjetaVariante
        icono={<IconoEsqueletoCompleto />}
        iconoBg={ACENTO_PESTANIA.explorar}
        titulo="Esqueleto completo"
        descripcion="Muestro el modelo entero y señalás el hueso que te pregunto."
        onClick={() => onElegir('test-esqueleto')}
      />
      <TarjetaVariante
        icono={<IconoHuesoAislado />}
        iconoBg={REGION_ACCENT.face.bg}
        titulo="Hueso aislado"
        descripcion="Muestro un hueso solo, sin contexto, para practicar reconocimiento."
        onClick={() => onElegir('test-hueso')}
      />
    </div>
  )
}

export function App() {
  const [modo, setModo] = useState<Modo>(modoInicial)
  // El estado de selección vive acá, no dentro de `ExploreView`: al volver
  // de la ficha completa tiene que sobrevivir, y solo quien decide qué
  // vista montar puede garantizarlo.
  const [selected, setSelected] = useState<SelectionId>(null)
  // Local, no un `Modo`: el panel es una capa encima de la vista actual, no
  // una transición — no pasa por `navegar` y no toca `window.history`.
  const [menuAbierto, setMenuAbierto] = useState(false)

  /**
   * El historial transporta el modo (ADR-013): cada transición empuja una
   * entrada con su `Modo` de destino, y el «atrás» del sistema la restituye.
   * No hay router ni URLs — `pushState` va sin tercer argumento a propósito.
   */
  const navegar = (siguiente: Modo) => {
    window.history.pushState(siguiente, '')
    setModo(siguiente)
  }

  useEffect(() => {
    // La entrada de arranque no trae `state` propio. Sembrarla hace que
    // retroceder hasta ella restituya Explorar explícitamente, en vez de
    // llegar al `popstate` con `null` y caer al respaldo.
    window.history.replaceState(modoInicial(), '')
    const alRetroceder = (evento: PopStateEvent) => {
      setModo(esModo(evento.state) ? evento.state : modoInicial())
      // El panel es una capa ajena al historial (no es un `Modo`): una
      // navegación real de "atrás" no le pertenece, así que no debe
      // sobrevivir montada encima de la vista a la que el sistema volvió.
      setMenuAbierto(false)
    }
    window.addEventListener('popstate', alRetroceder)
    return () => window.removeEventListener('popstate', alRetroceder)
  }, [])

  return (
    <main className="relative flex h-dvh flex-col bg-superficie text-tinta">
      {modo.tipo === 'ficha' ? (
        /* Mientras la ficha está abierta, la cabecera **es** la salida (e8.5,
           mockup): "Volver" y el nombre de la aplicación, sin pestañas ni
           íconos. No hay nada que elegir hasta volver. */
        <header
          data-testid="cabecera"
          className="mt-3 mb-3 mx-3.5 flex items-center gap-3 rounded-suave border-2 border-tinta bg-panel px-5 py-3 shadow-dura"
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="min-h-tactil rounded-full border-2 border-tinta bg-panel px-4 font-semibold text-sm text-tinta hover:bg-acento-suave"
          >
            ← Volver
          </button>
          {/* El nombre sigue siendo el encabezado de la página —sin él la
              vista queda sin título para un lector de pantalla— pero no se
              dibuja: en la ficha, "Volver" es lo único que hace falta ver. */}
          <h1 className="sr-only font-display">huesos-mono</h1>
        </header>
      ) : (
        <header
          data-testid="cabecera"
          className="mt-3 mb-3 flex items-stretch justify-between gap-2 px-3.5"
        >
          <h1 className="sr-only font-display">huesos-mono</h1>
          <LogoIcono />
          <Pestanas modo={modo} onCambiar={(tipo) => navegar({ tipo })} />
          <MenuIcono onClick={() => setMenuAbierto(true)} />
        </header>
      )}
      <div className="min-h-0 flex-1">
        {modo.tipo === 'explorar' && (
          <ExploreView
            selected={selected}
            onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
            onViewDetail={(id) => navegar({ tipo: 'ficha', boneId: id })}
          />
        )}
        {modo.tipo === 'fichas' && (
          <div className="h-full overflow-y-auto pt-2 pb-2 md:mx-auto md:max-w-2xl">
            <FichasAccordion
              bones={catalog}
              onSelect={(id) => navegar({ tipo: 'ficha', boneId: id })}
            />
          </div>
        )}
        {modo.tipo === 'ficha' && <BoneDetailView boneId={modo.boneId} />}
        {modo.tipo === 'test-elegir' && (
          <ElegirVarianteDeTest onElegir={(tipo) => navegar({ tipo })} />
        )}
        {modo.tipo === 'test-esqueleto' && (
          <SkeletonTestView onCambiarModo={() => window.history.back()} />
        )}
        {modo.tipo === 'test-hueso' && <BoneTestView onCambiarModo={() => window.history.back()} />}
      </div>
      {menuAbierto && <AboutPanel onClose={() => setMenuAbierto(false)} />}
    </main>
  )
}
