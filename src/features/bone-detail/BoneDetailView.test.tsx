import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'
import { BoneDetailView } from './BoneDetailView'

/**
 * `IsolatedBoneScene` se sustituye por un doble: WebGL no existe en jsdom,
 * mismo criterio que `ExploreView.test.tsx` ya aplica a `SkeletonScene`.
 */
vi.mock('../../components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: ({ boneId }: { boneId: string }) => (
    // El doble reproduce la etiqueta accesible del componente real, que se
    // calcula del nombre del hueso: sin ella, el defecto de anunciar una vista
    // 3D inexistente sería invisible para las pruebas.
    <div
      role="img"
      data-testid="escena-aislada-sustituida"
      data-hueso={boneId}
      aria-label={`${findBone(catalog, boneId)?.es ?? 'Hueso'}, aislado en 3D`}
    />
  ),
}))

describe('la ficha completa de un hueso', () => {
  it('muestra la escena aislada y la identidad del hueso pedido', () => {
    render(<BoneDetailView boneId="femur-right" />)
    expect(screen.getByTestId('escena-aislada-sustituida')).toHaveAttribute(
      'data-hueso',
      'femur-right',
    )
    expect(screen.getByRole('heading', { name: /fémur/i })).toBeInTheDocument()
  })

  it('no ofrece un segundo botón de ficha completa dentro de la ficha', () => {
    render(<BoneDetailView boneId="femur-right" />)
    expect(screen.queryByRole('button', { name: /ver ficha completa/i })).not.toBeInTheDocument()
  })
})

describe('la ficha de un hueso que el modelo no incluye', () => {
  it('explica la ausencia en vez de dejar un panel vacío', () => {
    render(<BoneDetailView boneId="malleus-right" />)

    // La razón tiene que estar donde iría la escena, no solo en el panel de
    // identidad: un lienzo negro al lado de un texto correcto sigue pareciendo
    // una aplicación rota.
    expect(screen.queryByTestId('escena-aislada-sustituida')).not.toBeInTheDocument()
    expect(screen.getByText(/no está en el modelo 3D/i)).toBeInTheDocument()

    // El motivo detallado sigue apareciendo una sola vez, en la ficha de
    // identidad: repetirlo en los dos paneles de la misma pantalla es ruido.
    expect(screen.getAllByText(/cavidad timpánica/i)).toHaveLength(1)
  })

  it('no anuncia una vista tridimensional que no existe', () => {
    render(<BoneDetailView boneId="malleus-right" />)

    expect(screen.queryByLabelText(/aislado en 3D/i)).not.toBeInTheDocument()
  })

  it('no cambia nada para un hueso que sí tiene geometría', () => {
    render(<BoneDetailView boneId="femur-right" />)

    expect(screen.getByTestId('escena-aislada-sustituida')).toHaveAttribute(
      'data-hueso',
      'femur-right',
    )
  })
})
