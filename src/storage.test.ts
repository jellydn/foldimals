import { clampStepIndices, completeAnimal, emptyProgress, loadProgress, saveProgress, STORAGE_KEY } from './storage'

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

  it('clamps current step indices to valid ranges against lesson step counts', () => {
    const counts = { dog: 6, cat: 6 }
    expect(clampStepIndices({ completed: [], current: { dog: 99, cat: -3 } }, counts)).toEqual({
      completed: [],
      current: { dog: 5, cat: 0 },
    })
    // Unknown animals are reset to 0, existing keys are preserved
    expect(clampStepIndices({ completed: [], current: { dog: 3, bird: 2 } }, counts)).toEqual({
      completed: [],
      current: { dog: 3, bird: 0 },
    })
  })

  it('resets indices whose step count is missing or invalid', () => {
    expect(clampStepIndices({ completed: [], current: { dog: 4 } }, {})).toEqual({ completed: [], current: { dog: 0 } })
    expect(clampStepIndices({ completed: [], current: { dog: 4 } }, { dog: -1 })).toEqual({ completed: [], current: { dog: 0 } })
  })
})
