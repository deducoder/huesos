import { useState } from 'react'
import { BoneNavigator } from './components/BoneNavigator'
import { catalog } from './data/catalog'
import { type SelectionId, toggleSelection } from './domain/selection'
import { BoneDetailView } from './features/bone-detail/BoneDetailView'
import { ExploreView } from './features/explore/ExploreView'

/**
 * Qué vista está montada, sin router (ADR-003): la aplicación no necesita
 * enlaces profundos por hueso todavía, y esto evita una dependencia nueva.
 *
 * `origen` en el modo `'ficha'` decide a dónde vuelve "Volver": si se llegó
 * desde `ExploreView` (e3.2) o desde la lista sin escena (e3.3, `RF-03`).
 */
type Modo =
  | { tipo: 'explorar' }
  | { tipo: 'fichas' }
  | { tipo: 'ficha'; boneId: string; origen: 'explorar' | 'fichas' }

/**
 * Las pestañas de nivel superior. Ocultas en modo `'ficha'`: no hay nada que
 * elegir mientras se está viendo una, "Volver" ya cubre esa salida.
 */
function Pestanas({
  modo,
  onCambiar,
}: {
  modo: Modo
  onCambiar: (tipo: 'explorar' | 'fichas') => void
}) {
  const clase = (activa: boolean) =>
    `rounded px-3 py-1.5 text-sm ${activa ? 'bg-sky-700 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800'}`
  return (
    <nav className="flex gap-2 border-slate-800 border-b px-6 py-2" aria-label="Modo de estudio">
      <button
        type="button"
        onClick={() => onCambiar('explorar')}
        className={clase(modo.tipo === 'explorar')}
      >
        Explorar
      </button>
      <button
        type="button"
        onClick={() => onCambiar('fichas')}
        className={clase(modo.tipo === 'fichas')}
      >
        Fichas
      </button>
    </nav>
  )
}

export function App() {
  const [modo, setModo] = useState<Modo>({ tipo: 'explorar' })
  // El estado de selección vive acá, no dentro de `ExploreView`: al volver
  // de la ficha completa tiene que sobrevivir, y solo quien decide qué
  // vista montar puede garantizarlo.
  const [selected, setSelected] = useState<SelectionId>(null)

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-slate-800 border-b px-6 py-3">
        <h1 className="font-semibold text-xl">huesos-mono</h1>
      </header>
      {modo.tipo !== 'ficha' && <Pestanas modo={modo} onCambiar={(tipo) => setModo({ tipo })} />}
      <div className="min-h-0 flex-1">
        {modo.tipo === 'explorar' && (
          <ExploreView
            selected={selected}
            onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
            onViewDetail={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'explorar' })}
          />
        )}
        {modo.tipo === 'fichas' && (
          <div className="h-full overflow-y-auto py-2">
            <BoneNavigator
              bones={catalog}
              selected={null}
              onSelect={(id) => setModo({ tipo: 'ficha', boneId: id, origen: 'fichas' })}
            />
          </div>
        )}
        {modo.tipo === 'ficha' && (
          <BoneDetailView boneId={modo.boneId} onBack={() => setModo({ tipo: modo.origen })} />
        )}
      </div>
    </main>
  )
}
