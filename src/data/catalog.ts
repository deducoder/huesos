import type { Bone } from './bone'

/**
 * El catálogo de huesos. Se puebla por regiones: la columna en e1.5, el resto
 * en e1.6. Las entradas sin geometría declaran por qué no la tienen.
 *
 * Cobertura objetivo: 199 de los 206 huesos. Los 7 restantes —los seis
 * huesecillos del oído medio y el hioides— no están en el modelo porque no son
 * visibles en un esqueleto completo, y se declaran como ausencia explícita.
 */
export const catalog: Bone[] = [
  {
    id: 'femur-right',
    meshName: 'Femur.r',
    side: 'right',
    es: 'fémur',
    la: 'os femoris',
    synonyms: ['hueso del muslo'],
    region: 'lower-limb',
  },
  {
    id: 'femur-left',
    meshName: 'Femur.r',
    side: 'left',
    es: 'fémur',
    la: 'os femoris',
    synonyms: ['hueso del muslo'],
    region: 'lower-limb',
  },
  {
    id: 'sphenoid',
    meshName: 'Sphenoid bone',
    side: null,
    es: 'esfenoides',
    la: 'os sphenoidale',
    synonyms: ['hueso esfenoides'],
    region: 'cranium',
  },
  {
    id: 'hyoid',
    meshName: null,
    side: null,
    es: 'hioides',
    la: 'os hyoideum',
    synonyms: ['hueso hioides'],
    region: 'hyoid',
    missingReason:
      'No articula con ningún otro hueso y el modelo del esqueleto no lo incluye; necesita vista propia.',
  },
]
