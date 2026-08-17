import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BoneDetailView } from './BoneDetailView'

/**
 * `IsolatedBoneScene` se sustituye por un doble: WebGL no existe en jsdom,
 * mismo criterio que `ExploreView.test.tsx` ya aplica a `SkeletonScene`.
 */
vi.mock('../../components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: ({ boneId }: { boneId: string }) => (
    <div data-testid="escena-aislada-sustituida" data-hueso={boneId} />
  ),
}))

describe('la ficha completa de un hueso', () => {
  it('muestra la escena aislada y la identidad del hueso pedido', () => {
    render(<BoneDetailView boneId="femur-right" onBack={vi.fn()} />)
    expect(screen.getByTestId('escena-aislada-sustituida')).toHaveAttribute(
      'data-hueso',
      'femur-right',
    )
    expect(screen.getByRole('heading', { name: /fémur/i })).toBeInTheDocument()
  })

  it('vuelve al llamar a "Volver"', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<BoneDetailView boneId="femur-right" onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: /volver/i }))
    expect(onBack).toHaveBeenCalled()
  })

  it('no ofrece un segundo botón de ficha completa dentro de la ficha', () => {
    render(<BoneDetailView boneId="femur-right" onBack={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /ver ficha completa/i })).not.toBeInTheDocument()
  })
})
