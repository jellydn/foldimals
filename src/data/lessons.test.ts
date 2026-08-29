import { isLessonUnlocked, lessons } from './lessons'

describe('lesson progression', () => {
  it('has five lessons in progression order with requested step ranges', () => {
    expect(lessons.map((lesson) => lesson.id)).toEqual(['dog', 'cat', 'mouse', 'frog', 'bird'])
    expect(lessons.map((lesson) => lesson.steps.length)).toEqual([6, 6, 7, 8, 9])
    lessons.forEach((lesson) => lesson.steps.forEach((step) => expect(step.guide).toBeDefined()))
  })

  it('unlocks only after the previous animal is complete', () => {
    expect(isLessonUnlocked(0, [])).toBe(true)
    expect(isLessonUnlocked(1, [])).toBe(false)
    expect(isLessonUnlocked(1, ['dog'])).toBe(true)
    expect(isLessonUnlocked(2, ['dog'])).toBe(false)
    expect(isLessonUnlocked(2, ['dog', 'cat'])).toBe(true)
  })
})
