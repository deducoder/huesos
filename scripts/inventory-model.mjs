#!/usr/bin/env node
// Inventario del modelo: lista cada malla clasificada, para poblar el catálogo
// a mano a partir de una lista generada en vez de leyendo un visor 3D.
//
// Reejecutable a propósito: cuando AnatomyTOOL publique otra versión, esto
// permite compararla contra el catálogo en vez de revisarla a ojo.
//
// Uso: node scripts/inventory-model.mjs [modelo.glb] [--kind=bone] [--json]

import { readFileSync } from 'node:fs'
import { readGlb } from './glb.mjs'
import { classifyMesh } from './inventory.mjs'

const args = process.argv.slice(2)
const modelo = args.find((a) => !a.startsWith('--')) ?? 'src/data/skeleton.glb'
const filtro = args.find((a) => a.startsWith('--kind='))?.split('=')[1]
const comoJson = args.includes('--json')

const glb = readGlb(readFileSync(modelo))
const inventario = glb.nodes
  .filter((n) => n.mesh !== undefined)
  .map((n) => ({ mesh: n.name ?? '', ...classifyMesh(n.name ?? '') }))
  .filter((e) => !filtro || e.kind === filtro)
  .sort((a, b) => a.base.localeCompare(b.base) || (a.side ?? '').localeCompare(b.side ?? ''))

if (comoJson) {
  console.log(JSON.stringify(inventario, null, 2))
} else {
  const ancho = Math.max(...inventario.map((e) => e.mesh.length))
  for (const e of inventario) {
    console.log(`${e.mesh.padEnd(ancho)}  ${e.kind.padEnd(9)} ${e.side ?? '-'}`)
  }
  const cuenta = (k) => inventario.filter((e) => e.kind === k).length
  console.error(
    `\n${inventario.length} mallas · ${cuenta('bone')} óseas · ${cuenta('tooth')} dientes · ` +
      `${cuenta('cartilage')} cartílagos · ${cuenta('sesamoid')} sesamoideos`,
  )
}
