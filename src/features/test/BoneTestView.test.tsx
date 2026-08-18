import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'
import { BoneTestView } from './BoneTestView'

/**
 * El doble reproduce el comportamiento real de `IsolatedBoneScene` para el
 * `aria-label`, no uno inventado: sin la prop `accessibleLabel` explícita,
 * el componente real calcula el label a partir de `boneId` — y por eso, sin
 * el fix, filtraría el nombre igual que el real.
 */
vi.mock('../../components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: ({
    boneId,
    accessibleLabel,
  }: {
    boneId: string
    accessibleLabel?: string
  }) => {
    const bone = findBone(catalog, boneId)
    const label = accessibleLabel ?? (bone ? `${bone.es}, aislado en 3D` : 'Hueso aislado en 3D')
    return (
      <div
        data-testid="escena-aislada-sustituida"
        data-hueso={boneId}
        role="img"
        aria-label={label}
      />
    )
  },
}))

describe('BoneTestView', () => {
  it('must-data-010: ninguna de las 3 opciones llega marcada como correcta antes de responder', () => {
    render(<BoneTestView onCambiarModo={vi.fn()} />)
    const grupo = screen.getByRole('group', { name: /qué hueso es/i })
    const opciones = within(grupo).getAllByRole('button')
    expect(opciones).toHaveLength(3)
    for (const opcion of opciones) {
      expect(opcion).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('must-data-003: tampoco en ningún aria-label — un lector de pantalla no debe anunciarlo', () => {
    render(<BoneTestView onCambiarModo={vi.fn()} />)
    const conAriaLabel = document.querySelectorAll('[aria-label]')
    for (const elemento of conAriaLabel) {
      const label = elemento.getAttribute('aria-label') ?? ''
      for (const bone of catalog) {
        expect(label).not.toContain(bone.es)
        expect(label).not.toContain(bone.la)
      }
    }
  })

  it('la pista accesible no dice "escribí" — el formato por defecto es opción múltiple', () => {
    render(<BoneTestView onCambiarModo={vi.fn()} />)
    const escena = screen.getByTestId('escena-aislada-sustituida')
    expect(escena.getAttribute('aria-label') ?? '').not.toMatch(/escrib/i)
  })

  it('monta la escena aislada con un hueso señalado', () => {
    render(<BoneTestView onCambiarModo={vi.fn()} />)
    const escena = screen.getByTestId('escena-aislada-sustituida')
    expect(escena.dataset.hueso).toBeTruthy()
  })

  it('no monta ninguna vía con nombre visible', () => {
    render(<BoneTestView onCambiarModo={vi.fn()} />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
