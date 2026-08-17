import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'
import { TestQuestion } from './TestQuestion'

const renderScenaSustituida = (boneId: string) => <div data-testid="escena" data-hueso={boneId} />

describe('TestQuestion', () => {
  it('must-data-003: ningún nombre del catálogo aparece en el DOM antes de responder', () => {
    render(<TestQuestion bones={catalog} renderScene={renderScenaSustituida} />)
    const texto = document.body.textContent ?? ''
    for (const bone of catalog) {
      expect(texto).not.toContain(bone.es)
      expect(texto).not.toContain(bone.la)
      for (const sinonimo of bone.synonyms) {
        expect(texto).not.toContain(sinonimo)
      }
    }
  })

  it('monta exactamente una escena', () => {
    render(<TestQuestion bones={catalog} renderScene={renderScenaSustituida} />)
    expect(screen.getAllByTestId('escena')).toHaveLength(1)
  })

  it('muestra "Correcto" en texto al responder bien', async () => {
    const user = userEvent.setup()
    render(<TestQuestion bones={catalog} renderScene={renderScenaSustituida} />)

    const boneId = screen.getByTestId('escena').dataset.hueso
    const bone = findBone(catalog, boneId ?? null)
    if (!bone) throw new Error('la pregunta no eligió un hueso válido')

    await user.type(screen.getByRole('textbox'), bone.es)
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^correcto$/i)).toBeInTheDocument()
  })

  it('muestra "Incorrecto" en texto al responder mal', async () => {
    const user = userEvent.setup()
    render(<TestQuestion bones={catalog} renderScene={renderScenaSustituida} />)

    await user.type(screen.getByRole('textbox'), 'esta respuesta no es ningún hueso real')
    await user.click(screen.getByRole('button', { name: /responder/i }))

    expect(screen.getByText(/^incorrecto$/i)).toBeInTheDocument()
  })

  it('"Siguiente pregunta" nunca repite el hueso inmediatamente anterior', async () => {
    const user = userEvent.setup()
    render(<TestQuestion bones={catalog} renderScene={renderScenaSustituida} />)

    for (let i = 0; i < 50; i++) {
      const anterior = screen.getByTestId('escena').dataset.hueso
      await user.click(screen.getByRole('button', { name: /responder/i }))
      await user.click(screen.getByRole('button', { name: /siguiente pregunta/i }))
      const siguiente = screen.getByTestId('escena').dataset.hueso
      expect(siguiente).not.toBe(anterior)
    }
  })
})
