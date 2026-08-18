import type { BoneRegion } from '../data/bone'

/**
 * e8.5 (iteración informal de fidelidad visual): un color por región,
 * tomado del mockup real (`refs/huesos-mono-ui.html`, `REGION_STYLES`)
 * para las 5 regiones que cubría, y extendido con el mismo criterio
 * —lightness ~0.82-0.88, chroma ~0.11-0.13 OKLCH, un matiz distinto por
 * región— para las que el mockup no llegó a necesitar. `ear`/`hyoid`
 * comparten el tratamiento neutro del mockup: las dos son regiones sin
 * malla en el modelo, igual que su `NEUTRAL_STYLE`.
 *
 * Extrapolación mía, no un valor literal del mockup — a confirmar
 * visualmente, no una fuente de verdad.
 */
export const REGION_ACCENT: Record<BoneRegion, { bg: string; text: string }> = {
  cranium: { bg: '#f2d76c', text: '#604b00' },
  face: { bg: '#ffadb4', text: '#852535' },
  ear: { bg: '#e3e5e8', text: '#45484c' },
  hyoid: { bg: '#e3e5e8', text: '#45484c' },
  spine: { bg: '#c6baff', text: '#493687' },
  thorax: { bg: '#ffac6e', text: '#7d2900' },
  'shoulder-girdle': { bg: '#eaaef8', text: '#652a72' },
  'upper-limb': { bg: '#89da9b', text: '#00521f' },
  'pelvic-girdle': { bg: '#ffa7d9', text: '#752257' },
  'lower-limb': { bg: '#5ddae0', text: '#005157' },
}
