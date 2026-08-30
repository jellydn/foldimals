import { render, screen } from '@testing-library/react'
import { AnimalArt } from './AnimalArt'

describe('AnimalArt', () => {
  const animals = ['dog', 'cat', 'mouse', 'frog', 'bird'] as const

  it.each(animals.map((animal) => [animal, animal] as const))('renders a labeled svg for %s', (animal) => {
    render(<AnimalArt animal={animal} color="#ffc86b" />)
    const svg = screen.getByRole('img', { name: `${animal} origami` })
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('accepts a className onto the svg', () => {
    render(<AnimalArt animal="dog" color="#ffc86b" className="final-animal" />)
    expect(screen.getByRole('img', { name: 'dog origami' })).toHaveClass('final-animal')
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