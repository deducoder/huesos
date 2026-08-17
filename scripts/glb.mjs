// Lector y escritor mínimos de glTF binario (GLB 2.0).
// Herramienta de desarrollo: no entra en el bundle. La capa src/data/ son
// datos puros, así que el parseo vive aquí y no allí.

const MAGIC = 0x46546c67 // 'glTF'
const JSON_CHUNK = 0x4e4f534a
const BIN_CHUNK = 0x004e4942

/** Devuelve el JSON del GLB, con el chunk binario colgado en `__bin`. */
export function readGlb(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  if (view.getUint32(0, true) !== MAGIC) throw new Error('no es un archivo GLB')

  let offset = 12
  let json = null
  let bin = null
  while (offset < buffer.byteLength) {
    const length = view.getUint32(offset, true)
    const type = view.getUint32(offset + 4, true)
    const start = offset + 8
    if (type === JSON_CHUNK) json = JSON.parse(buffer.subarray(start, start + length).toString('utf8'))
    if (type === BIN_CHUNK) bin = buffer.subarray(start, start + length)
    offset = start + length
  }
  if (!json) throw new Error('el GLB no tiene chunk JSON')
  json.__bin = bin
  return json
}

const pad4 = (n) => (n + 3) & ~3

/** Serializa un GLB a partir del JSON y su chunk binario. */
export function writeGlb(json, bin) {
  const { __bin, ...clean } = json
  const jsonBytes = Buffer.from(JSON.stringify(clean), 'utf8')
  const jsonPad = Buffer.alloc(pad4(jsonBytes.length) - jsonBytes.length, 0x20)
  const binBytes = bin ?? Buffer.alloc(0)
  const binPad = Buffer.alloc(pad4(binBytes.length) - binBytes.length, 0)

  const total = 12 + 8 + jsonBytes.length + jsonPad.length + (binBytes.length ? 8 + binBytes.length + binPad.length : 0)
  const header = Buffer.alloc(12)
  header.writeUInt32LE(MAGIC, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(total, 8)

  const chunk = (length, type) => {
    const head = Buffer.alloc(8)
    head.writeUInt32LE(length, 0)
    head.writeUInt32LE(type, 4)
    return head
  }

  const parts = [header, chunk(jsonBytes.length + jsonPad.length, JSON_CHUNK), jsonBytes, jsonPad]
  if (binBytes.length) parts.push(chunk(binBytes.length + binPad.length, BIN_CHUNK), binBytes, binPad)
  return Buffer.concat(parts)
}
