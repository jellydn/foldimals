import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('exposes labeled progress and clamps values to its valid range', () => {
    render(<ProgressBar color="#ff785f" label="Lesson progress" value={120} />)

    expect(screen.getByRole('progressbar', { name: 'Lesson progress' })).toHaveAttribute('aria-valuenow', '100')
  })

  it('keeps decorative progress out of the accessibility tree', () => {
    const { container } = render(<ProgressBar color="#ff785f" size="compact" value={25} />)

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
