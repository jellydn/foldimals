import '@testing-library/jest-dom/vitest'

Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true })
Object.defineProperty(URL, 'createObjectURL', { value: () => 'blob:photo', writable: true })
Object.defineProperty(URL, 'revokeObjectURL', { value: () => undefined, writable: true })

const values = new Map<string, string>()
const storage: Storage = {
  get length() { return values.size },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => { values.delete(key) },
  setItem: (key, value) => { values.set(key, value) },
}
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
