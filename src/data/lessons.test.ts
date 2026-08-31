import { isLessonUnlocked, lessons } from './lessons'

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
  it('has five lessons in progression order with requested step ranges', () => {
    expect(lessons.map((lesson) => lesson.id)).toEqual(['dog', 'cat', 'mouse', 'frog', 'bird'])
    expect(lessons.map((lesson) => lesson.steps.length)).toEqual([6, 6, 7, 8, 9])
    lessons.forEach((lesson) => lesson.steps.forEach((step) => expect(step.guide).toBeDefined()))
  })

  it('provides a strong lesson color with readable white text', () => {
    lessons.forEach((lesson) => expect(contrastRatio(lesson.strongColor, '#ffffff')).toBeGreaterThanOrEqual(4.5))
  })

  it('unlocks only after the previous animal is complete', () => {
    expect(isLessonUnlocked(0, [])).toBe(true)
    expect(isLessonUnlocked(1, [])).toBe(false)
    expect(isLessonUnlocked(1, ['dog'])).toBe(true)
    expect(isLessonUnlocked(2, ['dog'])).toBe(false)
    expect(isLessonUnlocked(2, ['dog', 'cat'])).toBe(true)
  })
})
