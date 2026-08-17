import type { Bone } from '../data/bone'
import { REGION_LABEL, SIDE_LABEL } from './labels'

interface Props {
  bone: Bone | undefined
}

/**
 * El hueso elegido, con las dos nomenclaturas juntas.
 *
 * Es el tercer canal de `must-a11y-005`: el navegador marca la selección con
 * `aria-pressed`, la escena la resalta, y esto la escribe con todas las letras.
 * El color nunca viaja solo.
 */
export function BoneIdentity({ bone }: Props) {
  if (!bone) {
    return (
      <section className="p-6" aria-labelledby="identidad-vacia">
        <h2 id="identidad-vacia" className="text-slate-400">
          Elegí un hueso para ver su nombre
        </h2>
        <p className="mt-2 text-slate-500 text-sm">
          Podés recorrer la lista con el teclado o girar el esqueleto y hacer clic.
        </p>
        <p role="status" aria-live="polite" className="sr-only" />
      </section>
    )
  }

  return (
    <section className="p-6" aria-labelledby="identidad-hueso">
      <h2 id="identidad-hueso" className="font-semibold text-2xl text-white">
        {bone.es}
      </h2>
      <p className="mt-1 text-lg text-sky-300 italic">{bone.la}</p>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-400">Región</dt>
          <dd>{REGION_LABEL[bone.region]}</dd>
        </div>
        {bone.side !== null && (
          <div className="flex gap-2">
            <dt className="text-slate-400">Lado</dt>
            <dd>{SIDE_LABEL[bone.side]}</dd>
          </div>
        )}
        {bone.synonyms.length > 0 && (
          <div className="flex gap-2">
            <dt className="text-slate-400">También</dt>
            <dd>{bone.synonyms.join(' · ')}</dd>
          </div>
        )}
      </dl>

      {bone.meshName === null && (
        <p className="mt-4 rounded border border-amber-700 bg-amber-950 p-3 text-amber-200 text-sm">
          No se puede señalar en el esqueleto. {bone.missingReason}
        </p>
      )}

      {/* Un lector de pantalla anuncia el cambio sin tener que ir a buscar el panel. */}
      <p role="status" aria-live="polite" className="sr-only">
        {bone.es}
        {bone.side !== null ? ` ${SIDE_LABEL[bone.side]}` : ''}, {bone.la}
      </p>
    </section>
  )
}
