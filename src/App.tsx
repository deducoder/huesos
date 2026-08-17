import { useState } from 'react'
import { BoneDetailView } from './features/bone-detail/BoneDetailView'
import { ExploreView } from './features/explore/ExploreView'
import { type SelectionId, toggleSelection } from './domain/selection'

/**
 * Qué vista está montada, sin router (ADR-003): la aplicación no necesita
 * enlaces profundos por hueso todavía, y esto evita una dependencia nueva.
 */
type Modo = { tipo: 'explorar' } | { tipo: 'ficha'; boneId: string }

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
      <div className="min-h-0 flex-1">
        {modo.tipo === 'explorar' ? (
          <ExploreView
            selected={selected}
            onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
            onViewDetail={(id) => setModo({ tipo: 'ficha', boneId: id })}
          />
        ) : (
          <BoneDetailView boneId={modo.boneId} onBack={() => setModo({ tipo: 'explorar' })} />
        )}
      </div>
    </main>
  )
}
