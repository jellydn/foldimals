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

  it.each(lessons)('shows the finished $id instead of guides for its final step', (lesson) => {
    const { container } = render(<OrigamiCanvas {...baseProps} lesson={lesson} step={lesson.steps.at(-1)!} />)
    expect(container.querySelector('.final-animal')).not.toBeNull()
    expect(screen.getByRole('img', { name: `${lesson.id} origami` })).toBeInTheDocument()
    expect(container.querySelector('.fold-guide')).toBeNull()
    expect(screen.getByText('Ta-da!')).toBeInTheDocument()
  })

  it.each(lessons)('renders visible paper for every intermediate $id step', (lesson) => {
    const { container, rerender } = render(<OrigamiCanvas {...baseProps} lesson={lesson} step={lesson.steps[0]} />)
    for (const step of lesson.steps.slice(0, -1)) {
      rerender(<OrigamiCanvas {...baseProps} lesson={lesson} step={step} detailedHelp />)
      expect(container.querySelector('.paper-motion polygon, .paper-motion rect, .paper-motion path')).not.toBeNull()
      if (step.action === 'Set up') expect(container.querySelector('.fold-guide')).toBeNull()
      else expect(container.querySelector('.fold-guide line.direction')).not.toBeNull()
      expect(container.querySelector('.final-animal')).toBeNull()
    }
  })
})
