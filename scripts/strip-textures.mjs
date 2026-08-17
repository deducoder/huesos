#!/usr/bin/env node
// Quita del modelo las texturas CC BY-NC-SA, dejando la geometría CC BY-SA 4.0.
//
// No basta con borrar las referencias: los bytes de las imágenes viven en el
// chunk binario y seguirían dentro del archivo. El buffer se reconstruye sin
// ellos y los índices de bufferView se remapean.
//
// Uso: node scripts/strip-textures.mjs <entrada.glb> <salida.glb>

import { readFileSync, writeFileSync } from 'node:fs'
import { readGlb, writeGlb } from './glb.mjs'

const [, , input, output] = process.argv
if (!input || !output) {
  console.error('uso: node scripts/strip-textures.mjs <entrada.glb> <salida.glb>')
  process.exit(2)
}

const glb = readGlb(readFileSync(input))
const bin = glb.__bin ?? Buffer.alloc(0)
const antes = { imagenes: glb.images?.length ?? 0, texturas: glb.textures?.length ?? 0 }

// 1 · bufferViews que sostienen imágenes: se van con ellas
const deImagenes = new Set((glb.images ?? []).map((i) => i.bufferView).filter((i) => i !== undefined))

// 2 · reconstruir el buffer solo con lo que se conserva, y remapear
const pad4 = (n) => (n + 3) & ~3
const remapeo = new Map()
const nuevasVistas = []
const trozos = []
let cursor = 0

glb.bufferViews.forEach((vista, indice) => {
  if (deImagenes.has(indice)) return
  const desde = vista.byteOffset ?? 0
  const datos = bin.subarray(desde, desde + vista.byteLength)
  remapeo.set(indice, nuevasVistas.length)
  nuevasVistas.push({ ...vista, byteOffset: cursor, byteLength: vista.byteLength })
  trozos.push(datos)
  const relleno = pad4(cursor + vista.byteLength) - (cursor + vista.byteLength)
  if (relleno) trozos.push(Buffer.alloc(relleno))
  cursor = pad4(cursor + vista.byteLength)
})

const apunta = (obj) => {
  if (obj?.bufferView === undefined) return
  const destino = remapeo.get(obj.bufferView)
  if (destino === undefined) throw new Error(`bufferView ${obj.bufferView} referenciado pero eliminado`)
  obj.bufferView = destino
}
for (const accessor of glb.accessors ?? []) apunta(accessor)
for (const malla of glb.meshes ?? []) {
  for (const primitiva of malla.primitives ?? []) {
    apunta(primitiva.extensions?.KHR_draco_mesh_compression)
  }
}

// 3 · quitar las texturas y toda referencia desde los materiales
for (const material of glb.materials ?? []) {
  for (const clave of Object.keys(material)) {
    if (clave.endsWith('Texture')) delete material[clave]
  }
  const pbr = material.pbrMetallicRoughness
  if (pbr) for (const clave of Object.keys(pbr)) if (clave.endsWith('Texture')) delete pbr[clave]
}
delete glb.images
delete glb.textures
delete glb.samplers

glb.bufferViews = nuevasVistas
const nuevoBin = Buffer.concat(trozos)
glb.buffers = [{ byteLength: nuevoBin.length }]

const salida = writeGlb(glb, nuevoBin)
writeFileSync(output, salida)

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
console.log(`entrada : ${kb(readFileSync(input).length)}  ${antes.imagenes} imágenes, ${antes.texturas} texturas`)
console.log(`salida  : ${kb(salida.length)}  0 imágenes, 0 texturas`)
console.log(`bufferViews: ${glb.bufferViews.length} (antes ${glb.bufferViews.length + deImagenes.size})`)
