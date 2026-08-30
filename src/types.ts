export type AnimalId = 'dog' | 'cat' | 'mouse' | 'frog' | 'bird'

export type DiagramId =
  | 'diamond'
  | 'square-cross'
  | 'rectangle'
  | 'triangle-down'
  | 'triangle-up'
  | 'triangle-side'
  | 'dog-ear-left'
  | 'dog-ears'
  | 'dog-snout'
  | 'dog-final'
  | 'cat-ear-left'
  | 'cat-ears'
  | 'cat-head'
  | 'cat-final'
  | 'mouse-kite-top'
  | 'mouse-kite'
  | 'mouse-ear'
  | 'mouse-nose'
  | 'mouse-final'
  | 'frog-roof'
  | 'frog-triangle'
  | 'frog-body'
  | 'frog-side-left'
  | 'frog-sides'
  | 'frog-final'
  | 'bird-kite'
  | 'bird-diamond'
  | 'bird-wing-one'
  | 'bird-wings'
  | 'bird-head'
  | 'bird-beak'
  | 'bird-final'

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
  diagram: DiagramId
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
