import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ATRIBUCION_LITERAL, LICENCIA_URL } from '../data/attribution'
import { AboutPanel } from './AboutPanel'

describe('AboutPanel', () => {
  it('es un diálogo modal con nombre accesible', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    const dialogo = screen.getByRole('dialog')
    expect(dialogo).toHaveAttribute('aria-modal', 'true')
    // El nombre accesible viene de un heading dentro, no de un `aria-label`
    // suelto: así el título también es legible a simple vista.
    expect(dialogo).toHaveAccessibleName()
  })

  it('muestra la fórmula literal de atribución, exacta', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByText(ATRIBUCION_LITERAL)).toBeInTheDocument()
  })

  it('enlaza a la licencia CC BY-SA 4.0', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    const enlace = screen.getByRole('link', { name: /creative commons|by-sa/i })
    expect(enlace).toHaveAttribute('href', LICENCIA_URL)
  })

  it('dice que el progreso no sale del navegador (must-privacy-006/RF-09)', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByText(/no sale de|solo en (este|tu) navegador/i)).toBeInTheDocument()
  })

  it('muestra la advertencia de exactitud que los autores del modelo declaran', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByText(/no garantizan su exactitud/i)).toBeInTheDocument()
  })

  it('acredita a quién desarrolló la aplicación (pedido en la verificación manual)', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByText(/desarrollado por dedu/i)).toBeInTheDocument()
  })

  it('dice sin ambigüedad que no hay rastreo ni fines de lucro', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByText(/sin rastreo/i)).toBeInTheDocument()
    expect(screen.getByText(/sin fines de lucro/i)).toBeInTheDocument()
  })

  it('al montar, el foco entra al panel', () => {
    render(<AboutPanel onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toHaveFocus()
  })

  it('Escape llama a onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AboutPanel onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('el botón de cerrar llama a onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AboutPanel onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
