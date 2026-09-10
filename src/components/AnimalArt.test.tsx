import { render, screen } from '@testing-library/react'
import { AnimalArt } from './AnimalArt'
import { paperShapes } from '../data/paperShapes'

describe('AnimalArt', () => {
  const animals = ['dog', 'cat', 'mouse', 'frog', 'bird', 'rabbit', 'fox', 'bear', 'pig', 'owl'] as const

  it.each(animals.map((animal) => [animal, animal] as const))('renders a labeled svg for %s', (animal) => {
    render(<AnimalArt animal={animal} color="#ffc86b" />)
    const svg = screen.getByRole('img', { name: `${animal} origami` })
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
    expect(svg.querySelector('path[fill="#ffc86b"], polygon[fill="#ffc86b"]')).not.toBeNull()
  })

  it('accepts a className onto the svg', () => {
    render(<AnimalArt animal="dog" color="#ffc86b" className="final-animal" />)
    expect(screen.getByRole('img', { name: 'dog origami' })).toHaveClass('final-animal')
  })

  it.each([
    ['mouse', 'mouse-nose'], ['frog', 'frog-chin'], ['bird', 'bird-beak'],
  ] as const)('uses the actual last folded paper layers for %s artwork', (animal, diagram) => {
    const { container } = render(<AnimalArt animal={animal} color="#ffc86b" />)
    expect([...container.querySelectorAll('polygon')].map((polygon) => polygon.getAttribute('points'))).toEqual(paperShapes[diagram])
  })

  it('does not render decorations by default', () => {
    render(<AnimalArt animal="dog" color="#ffc86b" />)
    expect(screen.queryByLabelText('star decorations')).not.toBeInTheDocument()
  })

  it('renders star decorations when decorated', () => {
    const { container } = render(<AnimalArt animal="dog" color="#ffc86b" decorated />)
    expect(container.querySelector('[aria-label="star decorations"]')).not.toBeNull()
    expect(container.querySelectorAll('[aria-label="star decorations"] path').length).toBeGreaterThan(0)
  })
})
