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

  it('un par sin geometría en ningún lado no muestra "Lado"', () => {
    // e7.5: martillo no tiene malla en ningún lado, y desde e7.4 el navegador
    // tampoco ofrece elegir el suyo — el panel no puede afirmar una elección
    // que el estudiante nunca hizo.
    render(<BoneIdentity bone={hueso('malleus-right')} />)
    const datos = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(datos).not.toContain('derecho')
    expect(datos).not.toContain('izquierdo')
  })

  it('un par sin geometría en ningún lado tampoco lo anuncia en el estado vivo', () => {
    render(<BoneIdentity bone={hueso('malleus-right')} />)
    expect(screen.getByRole('status')).not.toHaveTextContent(/derecho|izquierdo/i)
  })

  it('un par con geometría en al menos un lado sigue mostrando "Lado"', () => {
    render(<BoneIdentity bone={hueso('femur-right')} />)
    const datos = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(datos).toContain('derecho')
  })

  it('titula con el nombre corto y concuerda el lado con el género', () => {
    render(<BoneIdentity bone={hueso('clavicle-right')} />)
    expect(screen.getByRole('heading', { name: 'Clavícula' })).toBeVisible()
    expect(screen.getByText('derecha')).toBeVisible()
  })

  // El anuncio de la región viva no es un botón estrecho: lleva el nombre
  // del catálogo entero, como el resto de lo que oye un lector de pantalla.
  it('anuncia el nombre completo, sin acortar', () => {
    render(<BoneIdentity bone={hueso('hand-proximal-phalanx-2-right')} />)
    const anuncio = screen.getByRole('status')
    expect(anuncio).toHaveTextContent('falange proximal del segundo dedo de la mano derecha')
  })
})
