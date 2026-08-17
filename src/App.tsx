import { ExploreView } from './features/explore/ExploreView'

export function App() {
  return (
    <main className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-slate-800 border-b px-6 py-3">
        <h1 className="font-semibold text-xl">huesos-mono</h1>
      </header>
      <div className="min-h-0 flex-1">
        <ExploreView />
      </div>
    </main>
  )
}
