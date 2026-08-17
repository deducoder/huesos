import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SkeletonTestView } from './SkeletonTestView'

vi.mock('../../components/SkeletonScene', () => ({
  SkeletonScene: ({ selected }: { selected: string | null }) => (
    <div data-testid="escena-sustituida" data-hueso={selected ?? ''} />
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
})
