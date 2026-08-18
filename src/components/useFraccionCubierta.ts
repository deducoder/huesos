import { useLayoutEffect, useState } from 'react'

/**
 * Qué fracción del alto de un contenedor cubre un elemento flotante dentro
 * de él — la tarjeta de la ficha (`BoneDetailView`), la barra de respuesta
 * del test (`TestQuestion`).
 *
 * Se **mide**, no se supone: el flotante puede declarar un `max-h` pero su
 * alto real depende de su contenido, y reservar siempre el máximo encogería
 * lo que hay detrás sin motivo cuando el contenido es corto. `ResizeObserver`
 * dispara después del layout por definición, que es justo lo que hace falta
 * — medir antes da el tamaño intrínseco y no el real.
 *
 * Extraído de `BoneDetailView.tsx` (e3.2) para que `TestQuestion` (e9.2) lo
 * reutilice sin duplicarlo: el patrón —dos refs sobre elementos hermanos en
 * el mismo componente— es idéntico en los dos casos.
 */
export function useFraccionCubierta(
  contenedor: React.RefObject<HTMLDivElement | null>,
  flotante: React.RefObject<HTMLDivElement | null>,
): number {
  const [fraccion, setFraccion] = useState(0)

  useLayoutEffect(() => {
    const raiz = contenedor.current
    const elementoFlotante = flotante.current
    if (!raiz || !elementoFlotante) return

    const medir = () => {
      const alto = raiz.clientHeight
      if (alto === 0) return
      // Desde donde empieza el flotante hasta el borde inferior de la vista:
      // todo eso queda por debajo de él, incluido el aire de `bottom-4`.
      const cubierto =
        raiz.getBoundingClientRect().bottom - elementoFlotante.getBoundingClientRect().top
      setFraccion(Math.min(Math.max(cubierto / alto, 0), 0.9))
    }

    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(raiz)
    observador.observe(elementoFlotante)
    return () => observador.disconnect()
  }, [contenedor, flotante])

  return fraccion
}
