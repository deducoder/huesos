import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SkeletonTestView } from './SkeletonTestView'

vi.mock('../../components/SkeletonScene', () => ({
  SkeletonScene: ({
    selected,
    accessibleHint,
  }: {
    selected: string | null
    accessibleHint?: string
  }) => (
    <div data-testid="escena-sustituida" data-hueso={selected ?? ''}>
      <p className="sr-only">{accessibleHint}</p>
    </div>
  ),
}))

describe('SkeletonTestView', () => {
  it('monta la escena del esqueleto completo con un hueso señalado', () => {
    render(<SkeletonTestView onCambiarModo={vi.fn()} />)
    const escena = screen.getByTestId('escena-sustituida')
    expect(escena.dataset.hueso).toBeTruthy()
  })

  it('no monta ninguna vía con nombre visible', () => {
    render(<SkeletonTestView onCambiarModo={vi.fn()} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('la pista accesible no dice "escribí" — el formato por defecto es opción múltiple', () => {
    render(<SkeletonTestView onCambiarModo={vi.fn()} />)
    expect(document.body.textContent ?? '').not.toMatch(/escrib/i)
  })

  it('must-data-010: ninguna de las 3 opciones llega marcada como correcta antes de responder', () => {
    render(<SkeletonTestView onCambiarModo={vi.fn()} />)
    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    expect(opciones).toHaveLength(3)
    for (const opcion of opciones) {
      expect(opcion).toHaveAttribute('aria-pressed', 'false')
    }
  })
})
