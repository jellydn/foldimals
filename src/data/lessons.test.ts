import { isLessonUnlocked, lessons } from './lessons'
import { paperShapes } from './paperShapes'

const relativeLuminance = (color: string) => {
  const channels = color.match(/[\da-f]{2}/gi)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? []
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

const contrastRatio = (foreground: string, background: string) => {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a)
  return (luminances[0] + 0.05) / (luminances[1] + 0.05)
}

describe('lesson progression', () => {
  it('keeps the original five lessons first and appends five new animals', () => {
    expect(lessons.map((lesson) => lesson.id)).toEqual(['dog', 'cat', 'mouse', 'frog', 'bird', 'rabbit', 'fox', 'bear', 'pig', 'owl'])
    expect(lessons.map((lesson) => lesson.steps.length)).toEqual([6, 6, 7, 8, 5, 7, 6, 7, 7, 7])
    lessons.forEach((lesson) => lesson.steps.forEach((step) => expect(step.guide).toBeDefined()))
  })

  it('uses unique step IDs and visible, nonzero fold guides', () => {
    const steps = lessons.flatMap((lesson) => lesson.steps)
    expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length)
    for (const step of steps) {
      expect(step.guide.line[0]).not.toEqual(step.guide.line[1])
      expect(step.guide.arrow[0]).not.toEqual(step.guide.arrow[1])
      for (const point of [...step.guide.line, ...step.guide.arrow, ...step.guide.targets]) {
        expect(point.x).toBeGreaterThanOrEqual(0)
        expect(point.x).toBeLessThanOrEqual(300)
        expect(point.y).toBeGreaterThanOrEqual(0)
        expect(point.y).toBeLessThanOrEqual(300)
      }
    }
  })

  it('provides a strong lesson color with readable white text', () => {
    lessons.forEach((lesson) => expect(contrastRatio(lesson.strongColor, '#ffffff')).toBeGreaterThanOrEqual(4.5))
  })

  it.each(['mouse', 'frog', 'bird'])('%s uses connected paper states and geometrically valid fold arrows', (id) => {
    const lesson = lessons.find((item) => item.id === id)!
    expect(lesson.steps[0].action).toBe('Set up')
    expect(lesson.steps.at(-1)!.action).toBe('Draw')
    for (const [index, step] of lesson.steps.entries()) {
      if (step.action !== 'Fold') continue
      expect(step.startingDiagram).toBe(lesson.steps[index - 1].diagram)
      expect(paperShapes[step.diagram]).not.toEqual(paperShapes[step.startingDiagram!])
      const [a, b] = step.guide.line
      const [from, to] = step.guide.arrow
      // A flat fold keeps the midpoint on the crease and moves perpendicular to it.
      const dx = b.x - a.x
      const dy = b.y - a.y
      expect((to.x - from.x) * dx + (to.y - from.y) * dy).toBeCloseTo(0, 3)
      expect(((from.x + to.x) / 2 - a.x) * dy - ((from.y + to.y) / 2 - a.y) * dx).toBeCloseTo(0, 3)
      const startingPoints = paperShapes[step.startingDiagram!]!.join(' ').split(' ')
      expect(startingPoints).toContain(`${from.x},${from.y}`)
    }
  })

  it('unlocks only after the previous animal is complete', () => {
    expect(isLessonUnlocked(0, [])).toBe(true)
    expect(isLessonUnlocked(1, [])).toBe(false)
    expect(isLessonUnlocked(1, ['dog'])).toBe(true)
    expect(isLessonUnlocked(2, ['dog'])).toBe(false)
    expect(isLessonUnlocked(2, ['dog', 'cat'])).toBe(true)
  })

  it('unlocks every added lesson only after its immediate predecessor', () => {
    const predecessors = ['bird', 'rabbit', 'fox', 'bear', 'pig']
    predecessors.forEach((previous, offset) => {
      expect(isLessonUnlocked(offset + 5, ['dog'])).toBe(false)
      expect(isLessonUnlocked(offset + 5, [previous])).toBe(true)
    })
  })
})
