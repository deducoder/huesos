import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { findBone } from '../domain/selection'
import { BoneIdentity } from './BoneIdentity'

const hueso = (id: string) => findBone(catalog, id)

describe('el panel de identidad del hueso', () => {
  it('muestra las dos nomenclaturas del hueso elegido', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    expect(screen.getByRole('heading', { name: /fémur/i })).toBeInTheDocument()
    expect(screen.getByText('os femoris')).toBeInTheDocument()
  })

  it('dice su región y su lado en la lista de datos', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    // `derecho` aparece también en el anuncio en vivo, a propósito: se busca
    // aquí el dato de la lista de definiciones, no cualquier aparición.
    const datos = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(datos).toContain('Miembro inferior')
    expect(datos).toContain('derecho')
  })

  it('orienta cuando no hay nada elegido, en vez de quedarse en blanco', () => {
    render(<BoneIdentity bone={undefined} />)
    expect(screen.getByText(/elegí un hueso/i)).toBeInTheDocument()
  })

  it('muestra los sinónimos aceptados', () => {
    render(<BoneIdentity bone={hueso('scapula-right')} />)
    expect(screen.getByText(/omóplato/i)).toBeInTheDocument()
  })

  it('explica por qué un hueso no se puede mostrar en el esqueleto', () => {
    render(<BoneIdentity bone={hueso('malleus-left')} />)
    expect(screen.getByText(/timpánica|no.*visible/i)).toBeInTheDocument()
  })

  it('anuncia el cambio de selección en una región viva', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    const vivo = screen.getByRole('status')
    expect(vivo).toHaveTextContent(/fémur/i)
  })
})
