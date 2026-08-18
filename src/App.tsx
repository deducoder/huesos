import type { ReactNode } from 'react'
import { useState } from 'react'
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
 * `origen` en el modo `'ficha'` decide a dónde vuelve "Volver": si se llegó
 * desde `ExploreView` (e3.2) o desde la lista sin escena (e3.3, `RF-03`).
 *
 * `'test-elegir'` es la pestaña "Test" antes de elegir variante (e4.5);
 * `'test-esqueleto'`/`'test-hueso'` montan `RF-04`/`RF-05` respectivamente.
 */
type Modo =
  | { tipo: 'explorar' }
  | { tipo: 'fichas' }
  | { tipo: 'ficha'; boneId: string; origen: 'explorar' | 'fichas' }
  | { tipo: 'test-elegir' }
  | { tipo: 'test-esqueleto' }
  | { tipo: 'test-hueso' }

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
            className={`min-h-tactil w-20 rounded-[10px] px-1 text-center font-semibold text-sm ${
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
 * El logo y el botón de menú del mockup: cada uno su propio cuadrado
 * flotante, borde y sombra — el menú es decorativo por ahora, sin destino
 * (no hay drawer ni ajustes construidos), así que no es un `<button>`
 * clickeable que finja tener función.
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

function MenuIcono() {
  return (
    <IconoCuadrado>
      <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
        <rect width="18" height="2.6" rx="1.3" fill="currentColor" />
        <rect y="5.7" width="18" height="2.6" rx="1.3" fill="currentColor" />
        <rect y="11.4" width="18" height="2.6" rx="1.3" fill="currentColor" />
      </svg>
    </IconoCuadrado>
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
  const [modo, setModo] = useState<Modo>({ tipo: 'explorar' })
  // El estado de selección vive acá, no dentro de `ExploreView`: al volver
  // de la ficha completa tiene que sobrevivir, y solo quien decide qué
  // vista montar puede garantizarlo.
  const [selected, setSelected] = useState<SelectionId>(null)

  return (
    <main className="relative flex h-dvh flex-col bg-superficie text-tinta">
      {modo.tipo === 'ficha' ? (
        /* Mientras la ficha está abierta, la cabecera **es** la salida (e8.5,
           mockup): "Volver" y el nombre de la aplicación, sin pestañas ni
           íconos. No hay nada que elegir hasta volver. */
        <header
          data-testid="cabecera"
          className="flex items-center gap-3 border-tinta border-b-2 bg-panel px-5 py-3"
        >
          <button
            type="button"
            onClick={() => setModo({ tipo: modo.origen })}
            className="min-h-tactil rounded-full border-2 border-tinta bg-panel px-4 font-semibold text-sm text-tinta hover:bg-acento-suave"
          >
            ← Volver
          </button>
          <h1 className="font-display font-semibold text-base">huesos-mono</h1>
        </header>
      ) : (
        <header
          data-testid="cabecera"
          className="mt-3 mb-3 flex items-stretch justify-between gap-2 px-3.5"
        >
          <h1 className="sr-only font-display">huesos-mono</h1>
          <LogoIcono />
          <Pestanas modo={modo} onCambiar={(tipo) => setModo({ tipo })} />
          <MenuIcono />
        </header>
      )}
      <div className="min-h-0 flex-1">
        {modo.tipo === 'explorar' && (
          <ExploreView
            selected={selected}
            onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
            onViewDetail={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'explorar' })}
          />
        )}
        {modo.tipo === 'fichas' && (
          <div className="h-full overflow-y-auto pt-2 pb-2 md:mx-auto md:max-w-2xl">
            <FichasAccordion
              bones={catalog}
              onSelect={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'fichas' })}
            />
          </div>
        )}
        {modo.tipo === 'ficha' && <BoneDetailView boneId={modo.boneId} />}
        {modo.tipo === 'test-elegir' && (
          <ElegirVarianteDeTest onElegir={(tipo) => setModo({ tipo })} />
        )}
        {modo.tipo === 'test-esqueleto' && (
          <SkeletonTestView onCambiarModo={() => setModo({ tipo: 'test-elegir' })} />
        )}
        {modo.tipo === 'test-hueso' && (
          <BoneTestView onCambiarModo={() => setModo({ tipo: 'test-elegir' })} />
        )}
      </div>
    </main>
  )
}
