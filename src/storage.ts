import type { AnimalId, SavedProgress } from './types'

export const STORAGE_KEY = 'foldimals-progress-v1'
export const emptyProgress: SavedProgress = { completed: [], current: {} }

const clamp = (value: unknown, max: number): number => {
  const num = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return Math.min(Math.max(0, Math.floor(num)), max)
}

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): SavedProgress {
  try {
    const value = storage.getItem(STORAGE_KEY)
    if (!value) return emptyProgress
    const parsed = JSON.parse(value) as Partial<SavedProgress>
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      current: parsed.current && typeof parsed.current === 'object' ? parsed.current : {},
    }
  } catch {
    return emptyProgress
  }
}

export function saveProgress(progress: SavedProgress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

/** Clamp `current` step indices to a valid range for each animal's lesson length. */
export function clampStepIndices(progress: SavedProgress, stepCounts: Partial<Record<AnimalId, number>>): SavedProgress {
  const current: Partial<Record<AnimalId, number>> = { ...progress.current }
  for (const id of Object.keys(current) as AnimalId[]) {
    const count = stepCounts[id]
    current[id] = typeof count === 'number' && count > 0 ? clamp(current[id], count - 1) : 0
  }
  return { ...progress, current }
}

export function completeAnimal(progress: SavedProgress, id: AnimalId): SavedProgress {
  return {
    completed: progress.completed.includes(id) ? progress.completed : [...progress.completed, id],
    current: { ...progress.current, [id]: 0 },
  }
}
