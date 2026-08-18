import { type Bone, isUnpaired } from '../data/bone'
import { catalog } from '../data/catalog'
import { isSideIrrelevant } from '../domain/side-pairing'
import { REGION_LABEL, SIDE_LABEL } from './labels'
import { REGION_ACCENT } from './region-accent'

interface Props {
  bone: Bone | undefined
  /** Si se pasa, ofrece abrir la ficha completa del hueso elegido (RF-03). */
  onViewDetail?: (id: string) => void
}

/**
 * El hueso elegido, con las dos nomenclaturas juntas.
 *
 * Es el tercer canal de `must-a11y-005`: el navegador marca la selección con
 * `aria-pressed`, la escena la resalta, y esto la escribe con todas las letras.
 * El color nunca viaja solo.
 */
export function BoneIdentity({ bone, onViewDetail }: Props) {
  if (!bone) {
    return (
      <section className="p-6" aria-labelledby="identidad-vacia">
        <h2 id="identidad-vacia" className="text-tinta-suave">
          Elegí un hueso para ver su nombre
        </h2>
        <p className="mt-2 text-tinta-suave text-sm">
          Podés recorrer la lista con el teclado o girar el esqueleto y hacer clic.
        </p>
        <p role="status" aria-live="polite" className="sr-only" />
      </section>
    )
  }

  // Sin malla en ningún lado, elegir uno no distingue nada observable — el
  // navegador tampoco lo ofrece desde e7.4 (`toNavigatorRows`). El panel no
  // puede afirmar una elección que el estudiante nunca hizo.
  const ocultarLado = bone.side !== null && isSideIrrelevant(bone, catalog)
  const acento = REGION_ACCENT[bone.region]

  return (
    <section className="p-6" aria-labelledby="identidad-hueso">
      <h2 id="identidad-hueso" className="font-display font-semibold text-2xl text-tinta">
        {bone.es}
      </h2>
      <p className="mt-1 text-lg italic" style={{ color: acento.text }}>
        {bone.la}
      </p>

      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <dt className="sr-only">Región</dt>
          <dd
            className="w-fit rounded-full border-2 border-tinta px-3 py-1 font-semibold"
            style={{ backgroundColor: acento.bg, color: acento.text }}
          >
            {REGION_LABEL[bone.region]}
          </dd>
          {bone.side !== null && !ocultarLado && (
            <>
              <dt className="sr-only">Lado</dt>
              <dd className="w-fit rounded-full border-2 border-tinta bg-panel px-3 py-1 font-semibold">
                {SIDE_LABEL[bone.side]}
              </dd>
            </>
          )}
        </div>
        {isUnpaired(bone) && (
          <div className="flex gap-2">
            <dt className="text-tinta-suave">Lateralidad</dt>
            <dd>impar</dd>
          </div>
        )}
        {bone.synonyms.length > 0 && (
          <div className="flex gap-2">
            <dt className="text-tinta-suave">También</dt>
            <dd>{bone.synonyms.join(' · ')}</dd>
          </div>
        )}
      </dl>

      {bone.meshName === null && (
        <p className="mt-4 rounded-suave border-2 border-aviso bg-aviso-fondo p-3 text-aviso-tinta text-sm">
          No se puede señalar en el esqueleto. {bone.missingReason}
        </p>
      )}

      {onViewDetail && (
        <button
          type="button"
          onClick={() => onViewDetail(bone.id)}
          className="mt-4 min-h-tactil w-full rounded-full border-2 border-tinta bg-acento font-semibold text-panel shadow-dura hover:bg-acento-fuerte"
        >
          Ver ficha completa
        </button>
      )}

      {/* Un lector de pantalla anuncia el cambio sin tener que ir a buscar el panel. */}
      <p role="status" aria-live="polite" className="sr-only">
        {bone.es}
        {bone.side !== null && !ocultarLado ? ` ${SIDE_LABEL[bone.side]}` : ''}, {bone.la}
      </p>
    </section>
  )
}
