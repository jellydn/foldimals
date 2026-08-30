import { render, screen } from '@testing-library/react'
import { lessons } from '../data/lessons'
import { OrigamiCanvas } from './OrigamiCanvas'

const baseProps = {
  lesson: lessons[0],
  animationKey: 0,
  slow: false,
  detailedHelp: false,
}

describe('OrigamiCanvas', () => {
  it('renders a fold diagram with a crease and arrow for a normal step', () => {
    const { container } = render(<OrigamiCanvas {...baseProps} step={lessons[0].steps[0]} />)
    expect(screen.getByRole('img', { name: /Animated diagram/ })).toBeInTheDocument()
    expect(container.querySelector('line.crease')).not.toBeNull()
    expect(container.querySelector('line.direction')).not.toBeNull()
    expect(container.querySelector('.fold-guide')).not.toBeNull()
    expect(screen.getByText('Watch the arrow')).toBeInTheDocument()
  })

  it('shows emphasized crease and target dots when detailedHelp', () => {
    const { container } = render(<OrigamiCanvas {...baseProps} detailedHelp step={lessons[0].steps[0]} />)
    expect(container.querySelector('line.crease.emphasized')).not.toBeNull()
    expect(container.querySelectorAll('g.target circle').length).toBeGreaterThan(0)
    expect(screen.getByText('Match the glowing dots')).toBeInTheDocument()
  })

  it('adds is-slow class when slow', () => {
    const { container } = render(<OrigamiCanvas {...baseProps} slow step={lessons[0].steps[0]} />)
    expect(container.querySelector('.paper-stage')).toHaveClass('is-slow')
  })

  it('shows the finished animal instead of a diagram for a final step', () => {
    const { container } = render(<OrigamiCanvas {...baseProps} step={lessons[0].steps[5]} />)
    expect(container.querySelector('.final-animal')).not.toBeNull()
    expect(container.querySelector('.fold-guide')).toBeNull()
    expect(screen.getByText('Ta-da!')).toBeInTheDocument()
  })
})