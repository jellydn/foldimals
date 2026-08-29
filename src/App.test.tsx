import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { STORAGE_KEY } from './storage'

beforeEach(() => localStorage.clear())

describe('core journey', () => {
  it('starts with only Dog unlocked and enters its lesson', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Cat, locked' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Dog' }))
    expect(screen.getByRole('heading', { name: 'Dog' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /paper is ready/i }))
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
  })

  it('restores saved progress and unlocks completed progression', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: ['dog'], current: { cat: 2 } }))
    render(<App />)
    expect(screen.getByRole('button', { name: 'Cat' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Mouse, locked' })).toBeDisabled()
  })

  it('completes a lesson, adds it to the collection, and unlocks the next animal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Dog' }))
    await user.click(screen.getByRole('button', { name: /paper is ready/i }))
    for (let step = 1; step < 6; step += 1) {
      await user.click(screen.getByRole('button', { name: 'Next fold →' }))
    }
    await user.click(screen.getByRole('button', { name: /I did it/ }))
    expect(screen.getByText('Dog joined My Animals!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Choose another →' }))
    expect(screen.getByRole('button', { name: 'Cat' })).toBeEnabled()
  })
})
