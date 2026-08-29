import type { AnimalId, SavedProgress } from './types'

export const STORAGE_KEY = 'foldimals-progress-v1'
export const emptyProgress: SavedProgress = { completed: [], current: {} }

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

export function completeAnimal(progress: SavedProgress, id: AnimalId): SavedProgress {
  return {
    completed: progress.completed.includes(id) ? progress.completed : [...progress.completed, id],
    current: { ...progress.current, [id]: 0 },
  }
}
