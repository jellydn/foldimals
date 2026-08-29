import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { lessons } from '../data/lessons'
import { FoldingPlayer } from './FoldingPlayer'

describe('FoldingPlayer', () => {
  it('advances one fold at a time and shows progressive help', async () => {
    const user = userEvent.setup()
    render(<FoldingPlayer lesson={lessons[0]} initialStep={0} onStepChange={() => undefined} onExit={() => undefined} onComplete={() => undefined} />)

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'I need help' }))
    expect(screen.getByRole('button', { name: 'Show me more help' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show me more help' }))
    expect(screen.getByText(/Point one corner toward/)).toBeInTheDocument()
    expect(screen.getByText('Match the glowing dots')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next fold →' }))
    expect(screen.getByText('Step 2 of 6')).toBeInTheDocument()
    expect(screen.queryByText(/Point one corner toward/)).not.toBeInTheDocument()
  })
})
