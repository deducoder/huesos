import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { catalog } from '../../data/catalog'
import { BoneTestView } from './BoneTestView'

vi.mock('../../components/IsolatedBoneScene', () => ({
  IsolatedBoneScene: ({ boneId }: { boneId: string }) => (
    <div data-testid="escena-aislada-sustituida" data-hueso={boneId} />
  ),
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
