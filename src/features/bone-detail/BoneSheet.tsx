import { shortName, sideLabel } from '../../components/bone-name'
import { REGION_LABEL } from '../../components/labels'
import { REGION_ACCENT } from '../../components/region-accent'
import { type Bone, isUnpaired } from '../../data/bone'
import { catalog } from '../../data/catalog'
import { isSideIrrelevant } from '../../domain/side-pairing'

/** Una fila del par etiqueta/valor: dos celdas del mismo grid. */
function Fila({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-tinta-suave">{etiqueta}</dt>
      <dd>{children}</dd>
    </>
  )
}

/**
 * El cuerpo de la ficha completa, siguiendo el mockup (`refs/mock-ficha-completa.png`).
 *
 * No reutiliza `BoneIdentity`: ese componente resuelve el panel de *Explorar*,
 * donde el hueso cambia bajo el panel y la información se comprime en píldoras
 * junto a la escena. Acá el hueso ya está elegido y hay una pantalla entera —
 * el mockup escribe cada etiqueta a la vista, en una columna propia. Son dos
 * presentaciones distintas del mismo dato, no una con una variante; meterlas en
 * un componente con `variant` haría que cada ajuste de Explorar tuviera que
 * pensarse dos veces.
 */
export function BoneSheet({ bone }: { bone: Bone }) {
  // Sin malla en ningún lado, elegir uno no distingue nada observable — mismo
  // criterio que `BoneIdentity` y el navegador (e7.4).
  const ocultarLado = bone.side !== null && isSideIrrelevant(bone, catalog)
  const acento = REGION_ACCENT[bone.region]

  return (
    <section className="px-5 pt-5 pb-6" aria-labelledby="ficha-hueso">
      <h2 id="ficha-hueso" className="font-display font-semibold text-[27px] text-tinta">
        {shortName(bone.es)}
      </h2>
      <p className="mt-1 text-[15px] italic" style={{ color: acento.text }}>
        {bone.la}
      </p>

      <dl className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-3.5 gap-y-2.5 text-sm">
        <Fila etiqueta="Región">
          <span
            className="inline-flex w-fit rounded-full border-2 border-tinta px-3 py-1 font-bold"
            style={{ backgroundColor: acento.bg, color: acento.text }}
          >
            {REGION_LABEL[bone.region]}
          </span>
        </Fila>
        {bone.side !== null && !ocultarLado && (
          <Fila etiqueta="Lado">
            <span className="font-semibold">{sideLabel(bone.side, bone.gender)}</span>
          </Fila>
        )}
        {/* El título va acortado para caber en un teléfono (ADR-014). Lo que
            el acortado quita reaparece acá, y solo cuando quitó algo: repetir
            el mismo nombre dos veces no informa de nada. */}
        {shortName(bone.es).toLowerCase() !== bone.es.toLowerCase() && (
          <Fila etiqueta="Nombre completo">{bone.es}</Fila>
        )}
        {isUnpaired(bone) && <Fila etiqueta="Lateralidad">impar</Fila>}
        {bone.synonyms.length > 0 && <Fila etiqueta="También">{bone.synonyms.join(' · ')}</Fila>}
        {/* Contenido redactado, presente en pocas entradas: la fila no existe
            cuando el dato no existe, en vez de rotular un vacío. */}
        {bone.articulatesWith && <Fila etiqueta="Articula con">{bone.articulatesWith}</Fila>}
      </dl>

      {bone.clinicalNote && (
        <div className="mt-[18px] rounded-suave border-2 border-tinta bg-panel px-4 py-3.5 shadow-dura">
          <p
            className="mb-1.5 font-bold text-xs uppercase tracking-wide"
            style={{ color: acento.text }}
          >
            Dato clínico
          </p>
          <p className="text-sm leading-relaxed">{bone.clinicalNote}</p>
        </div>
      )}

      {bone.meshName === null && (
        <p className="mt-[18px] rounded-suave border-2 border-aviso bg-aviso-fondo p-3 text-aviso-tinta text-sm">
          No se puede señalar en el esqueleto. {bone.missingReason}
        </p>
      )}
    </section>
  )
}
