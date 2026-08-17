import { useState } from 'react'
import { BoneNavigator } from './components/BoneNavigator'
import { catalog } from './data/catalog'
import { toggleSelection } from './domain/selection'

export function App() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-slate-800 border-b px-6 py-3">
        <h1 className="font-semibold text-xl">huesos-mono</h1>
      </header>
      <div className="min-h-0 flex-1">
        <BoneNavigator
          bones={catalog}
          selected={selected}
          onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
        />
      </div>
    </main>
  )
}
