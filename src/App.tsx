import { useState } from 'react'
import { FichasAccordion } from './components/FichasAccordion'
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
 * Las pestañas de nivel superior. Ocultas en modo `'ficha'`: no hay nada que
 * elegir mientras se está viendo una, "Volver" ya cubre esa salida.
 */
function Pestanas({ modo, onCambiar }: { modo: Modo; onCambiar: (tipo: Pestania) => void }) {
  const clase = (activa: boolean) =>
    `inline-flex min-h-tactil min-w-tactil items-center justify-center rounded-suave border-2 border-tinta px-4 text-sm ${
      activa ? 'bg-acento font-semibold text-panel shadow-dura' : 'bg-panel text-tinta'
    }`
  const activa = (pestania: Pestania) =>
    modo.tipo === pestania || (pestania === 'test-elegir' && modo.tipo.startsWith('test-'))
  const etiqueta: Record<Pestania, string> = {
    explorar: 'Explorar',
    fichas: 'Fichas',
    'test-elegir': 'Test',
  }

  return (
    <nav className="flex items-center gap-2 py-2" aria-label="Modo de estudio">
      {PESTANIAS.map((pestania) => (
        <button
          key={pestania}
          type="button"
          onClick={() => onCambiar(pestania)}
          className={clase(activa(pestania))}
        >
          {etiqueta[pestania]}
        </button>
      ))}
    </nav>
  )
}

/** La elección de variante antes de empezar a preguntar (`RF-04` vs `RF-05`). */
function ElegirVarianteDeTest({
  onElegir,
}: {
  onElegir: (variante: 'test-esqueleto' | 'test-hueso') => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="text-tinta-suave">¿Sobre qué querés que te pregunte?</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onElegir('test-esqueleto')}
          className="min-h-tactil rounded-suave border-2 border-tinta px-4 hover:bg-acento-suave"
        >
          Esqueleto completo
        </button>
        <button
          type="button"
          onClick={() => onElegir('test-hueso')}
          className="min-h-tactil rounded-suave border-2 border-tinta px-4 hover:bg-acento-suave"
        >
          Hueso aislado
        </button>
      </div>
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
    <main className="flex h-dvh flex-col bg-superficie text-tinta">
      <header className="flex items-stretch justify-between gap-2 border-tinta border-b-2 bg-panel px-4">
        <h1 className="flex items-center font-display font-semibold text-lg">huesos-mono</h1>
        {modo.tipo !== 'ficha' && <Pestanas modo={modo} onCambiar={(tipo) => setModo({ tipo })} />}
      </header>
      <div className="min-h-0 flex-1">
        {modo.tipo === 'explorar' && (
          <ExploreView
            selected={selected}
            onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
            onViewDetail={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'explorar' })}
          />
        )}
        {modo.tipo === 'fichas' && (
          <div className="h-full overflow-y-auto py-2 md:mx-auto md:max-w-2xl">
            <FichasAccordion
              bones={catalog}
              onSelect={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'fichas' })}
            />
          </div>
        )}
        {modo.tipo === 'ficha' && (
          <BoneDetailView boneId={modo.boneId} onBack={() => setModo({ tipo: modo.origen })} />
        )}
        {modo.tipo === 'test-elegir' && (
          <ElegirVarianteDeTest onElegir={(tipo) => setModo({ tipo })} />
        )}
        {modo.tipo === 'test-esqueleto' && <SkeletonTestView />}
        {modo.tipo === 'test-hueso' && <BoneTestView />}
      </div>
    </main>
  )
}
