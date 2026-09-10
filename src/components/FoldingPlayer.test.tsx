import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { lessons } from '../data/lessons'
import { FoldingPlayer } from './FoldingPlayer'

describe('FoldingPlayer', () => {
  it.each(['mouse', 'frog', 'bird'])('compares %s shapes and resets the comparison on help, replay, and navigation', async (id) => {
    const user = userEvent.setup()
    const lesson = lessons.find((item) => item.id === id)!
    const { container } = render(<FoldingPlayer lesson={lesson} initialStep={1} onStepChange={() => undefined} onExit={() => undefined} onComplete={() => undefined} />)
    expect(container.querySelector('.paper-motion polygon')).toHaveAttribute('points', '150,40 260,150 150,260 40,150')
    await user.click(screen.getByRole('button', { name: 'Show folded shape' }))
    expect(container.querySelector('.paper-motion polygon')).toHaveAttribute('points', '40,150 260,150 150,260')
    expect(container.querySelector('.fold-guide')).toBeNull()
    expect(screen.getByRole('button', { name: 'Show starting shape' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'I need help' }))
    expect(screen.getByText(lesson.steps[1].hint)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show folded shape' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: 'Show me more help' }))
    expect(container.querySelector('.target')).not.toBeNull()
    await user.click(screen.getByRole('button', { name: 'Show folded shape' }))
    await user.click(screen.getByRole('button', { name: 'Replay animation' }))
    expect(screen.getByText('Match the glowing dots')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show folded shape' }))
    await user.click(screen.getByRole('button', { name: 'Next fold →' }))
    expect(screen.getByRole('button', { name: 'Show folded shape' })).toHaveAttribute('aria-pressed', 'false')
    expect(container.querySelector('.target')).toBeNull()
    await user.click(screen.getByRole('button', { name: '← Previous' }))
    expect(container.querySelector('.paper-motion polygon')).toHaveAttribute('points', '150,40 260,150 150,260 40,150')
  })

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
