import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'
import { BoneSheet } from './BoneSheet'

const hueso = (id: string) => {
  const encontrado = findBone(catalog, id)
  if (!encontrado) throw new Error(`el catálogo no tiene "${id}"`)
  return encontrado
}

describe('la ficha de un hueso', () => {
  it('rotula cada dato con su nombre a la vista, no solo para el lector de pantalla', () => {
    render(<BoneSheet bone={hueso('nasal-right')} />)

    // El mockup escribe las etiquetas en una columna propia: quien mira la
    // ficha tiene que poder leer "Región" y "Lado", no deducirlos del color
    // de una píldora.
    expect(screen.getByText('Región')).toBeVisible()
    expect(screen.getByText('Lado')).toBeVisible()
    expect(screen.getByText('derecho')).toBeVisible()
    expect(screen.getByText('También')).toBeVisible()
  })

  it('muestra con qué se articula y su dato clínico cuando el hueso los tiene', () => {
    render(<BoneSheet bone={hueso('nasal-right')} />)

    expect(screen.getByText('Articula con')).toBeVisible()
    expect(screen.getByText(/frontal, maxilar y hueso nasal contralateral/i)).toBeVisible()
    expect(screen.getByText(/dato clínico/i)).toBeVisible()
    expect(screen.getByText(/se fractura con más frecuencia/i)).toBeVisible()
  })

  it('omite esas dos filas en un hueso que no los tiene, en vez de dejarlas vacías', () => {
    // 202 de los 206 huesos están en este caso: el contenido anatómico existe
    // solo donde alguien lo escribió, y una etiqueta sin valor es peor que la
    // ausencia de la fila.
    const parietal = hueso('parietal-right')
    expect(parietal.articulatesWith, 'el fixture dejó de servir al caso').toBeUndefined()

    render(<BoneSheet bone={parietal} />)

    expect(screen.queryByText('Articula con')).not.toBeInTheDocument()
    expect(screen.queryByText(/dato clínico/i)).not.toBeInTheDocument()
  })

  it('no afirma un lado que elegir no distingue', () => {
    // Ningún lado del martillo tiene malla: el mismo criterio que el navegador
    // aplica desde e7.4 — la ficha no puede decir "derecho" de una elección
    // que el estudiante nunca pudo hacer.
    render(<BoneSheet bone={hueso('malleus-right')} />)

    expect(screen.queryByText('Lado')).not.toBeInTheDocument()
  })

  it('explica por qué un hueso no se puede señalar en el modelo', () => {
    render(<BoneSheet bone={hueso('malleus-right')} />)

    expect(screen.getByText(/cavidad timpánica/i)).toBeVisible()
  })
})
