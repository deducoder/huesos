import { render, screen } from '@testing-library/react'
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
    render(<SkeletonTestView />)
    const escena = screen.getByTestId('escena-sustituida')
    expect(escena.dataset.hueso).toBeTruthy()
  })

  it('no monta ninguna vía con nombre visible', () => {
    render(<SkeletonTestView />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('must-data-010: la pista accesible no dice "escribí" — el formato por defecto es opción múltiple', () => {
    render(<SkeletonTestView />)
    expect(document.body.textContent ?? '').not.toMatch(/escrib/i)
  })
})
