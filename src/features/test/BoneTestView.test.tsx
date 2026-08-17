import { render, screen } from '@testing-library/react'
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
  it('must-data-003: ningún nombre del catálogo aparece en el DOM antes de responder', () => {
    render(<BoneTestView />)
    const texto = document.body.textContent ?? ''
    for (const bone of catalog) {
      expect(texto).not.toContain(bone.es)
      expect(texto).not.toContain(bone.la)
      for (const sinonimo of bone.synonyms) {
        expect(texto).not.toContain(sinonimo)
      }
    }
  })

  it('must-data-003: tampoco en ningún aria-label — un lector de pantalla no debe anunciarlo', () => {
    render(<BoneTestView />)
    const conAriaLabel = document.querySelectorAll('[aria-label]')
    for (const elemento of conAriaLabel) {
      const label = elemento.getAttribute('aria-label') ?? ''
      for (const bone of catalog) {
        expect(label).not.toContain(bone.es)
        expect(label).not.toContain(bone.la)
      }
    }
  })

  it('monta la escena aislada con un hueso señalado', () => {
    render(<BoneTestView />)
    const escena = screen.getByTestId('escena-aislada-sustituida')
    expect(escena.dataset.hueso).toBeTruthy()
  })

  it('no monta ninguna vía con nombre visible', () => {
    render(<BoneTestView />)
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
