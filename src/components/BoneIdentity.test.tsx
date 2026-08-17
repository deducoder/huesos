import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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

  it('dice "impar" explícitamente, no solo omite el lado', () => {
    render(<BoneIdentity bone={hueso('sacrum')} />)
    const datos = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(datos).toContain('impar')
  })

  it('no dice "impar" en un hueso par', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    const datos = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(datos).not.toContain('impar')
  })

  it('ofrece ver la ficha completa cuando se le pasa el callback', async () => {
    const user = userEvent.setup()
    const onViewDetail = vi.fn()
    render(<BoneIdentity bone={hueso('femur-right')} onViewDetail={onViewDetail} />)

    await user.click(screen.getByRole('button', { name: /ver ficha completa/i }))
    expect(onViewDetail).toHaveBeenCalledWith('femur-right')
  })

  it('no muestra el botón de ficha completa sin el callback', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    expect(screen.queryByRole('button', { name: /ver ficha completa/i })).not.toBeInTheDocument()
  })

  it('no muestra el botón de ficha completa sin hueso elegido', () => {
    render(<BoneIdentity bone={undefined} onViewDetail={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /ver ficha completa/i })).not.toBeInTheDocument()
  })
})
