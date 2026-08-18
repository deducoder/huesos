import { useEffect, useRef } from 'react'
import { ATRIBUCION_LITERAL, LICENCIA_URL } from '../data/attribution'

/**
 * El panel de privacidad, licencia y créditos del modelo 3D (e9.7).
 *
 * Overlay propio, no el elemento nativo `<dialog>`: jsdom 30.0.1 —la
 * versión que este proyecto fija— no implementa `HTMLDialogElement.
 * showModal`, así que `<dialog>` sin él no atrapa el foco ni bloquea el
 * fondo — se comporta como un `<div>` con un atributo `open`, y además
 * degradaría las pruebas a código fuente, como las escenas 3D. Esto es DOM
 * plano: se puede probar de verdad.
 *
 * No toca `window.history` ni el `Modo` de `App`: es una capa encima de la
 * vista actual, no una transición (ADR-013 sigue gobernando solo los modos).
 */
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
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-panel-titulo"
        tabIndex={-1}
        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel p-5 shadow-dura"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="about-panel-titulo" className="font-display font-semibold text-lg">
            Privacidad y créditos
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex min-h-tactil min-w-tactil flex-none items-center justify-center rounded-full border-2 border-tinta bg-panel text-tinta"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <section className="mt-4">
          <h3 className="font-display font-semibold text-sm">Privacidad</h3>
          <p className="mt-1 text-sm">
            Tu progreso se guarda solo en este navegador. No hay cuenta, no hay servidor: no sale de
            tu teléfono.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="font-display font-semibold text-sm">Modelo 3D</h3>
          <p className="mt-1 text-sm">{ATRIBUCION_LITERAL}</p>
          <p className="mt-1 text-sm">
            Publicado bajo licencia{' '}
            <a href={LICENCIA_URL} target="_blank" rel="noreferrer noopener" className="underline">
              Creative Commons BY-SA 4.0
            </a>
            .
          </p>
          <p className="mt-2 text-tinta-suave text-sm">
            Los autores del modelo no garantizan su exactitud anatómica.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="font-display font-semibold text-sm">Descargo de responsabilidad</h3>
          <p className="mt-1 text-tinta-suave text-sm">
            La aplicación se ofrece tal cual, sin garantías de ningún tipo. Es una herramienta de
            estudio y no constituye asesoría médica ni sustituye el criterio de un profesional. El
            uso queda bajo tu propio riesgo: quien la desarrolla no es responsable por daños o
            perjuicios derivados de su uso.
          </p>
        </section>

        <section className="mt-4">
          <p className="text-tinta-suave text-sm">
            Sin rastreo. Sin fines de lucro. Desarrollado por DEDU · 2026.
          </p>
        </section>
      </div>
    </div>
  )
}
