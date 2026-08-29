export type AnimalId = 'dog' | 'cat' | 'mouse' | 'frog' | 'bird'

export interface Point {
  x: number
  y: number
}

export interface FoldGuide {
  line: [Point, Point]
  arrow: [Point, Point]
  targets: Point[]
}

export interface FoldStep {
  id: string
  instruction: string
  hint: string
  diagram: string
  guide: FoldGuide
}

export interface AnimalLesson {
  id: AnimalId
  name: string
  tagline: string
  difficulty: 'Easy' | 'Medium'
  minutes: number
  color: string
  paperColor: string
  steps: FoldStep[]
}

export interface SavedProgress {
  completed: AnimalId[]
  current: Partial<Record<AnimalId, number>>
}
