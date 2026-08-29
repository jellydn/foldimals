import { completeAnimal, emptyProgress, loadProgress, saveProgress, STORAGE_KEY } from './storage'

describe('progress storage', () => {
  it('safely handles missing and malformed progress', () => {
    expect(loadProgress({ getItem: () => null })).toEqual(emptyProgress)
    expect(loadProgress({ getItem: () => '{bad json' })).toEqual(emptyProgress)
  })

  it('persists steps and completes an animal only once', () => {
    let saved = ''
    const progress = { completed: [] as ('dog' | 'cat')[], current: { dog: 3 } }
    saveProgress(progress, { setItem: (key, value) => { expect(key).toBe(STORAGE_KEY); saved = value } })
    expect(JSON.parse(saved).current.dog).toBe(3)
    const once = completeAnimal(progress, 'dog')
    expect(completeAnimal(once, 'dog').completed).toEqual(['dog'])
  })
})
