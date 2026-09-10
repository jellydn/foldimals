export type AnimalId = 'dog' | 'cat' | 'mouse' | 'frog' | 'bird' | 'rabbit' | 'fox' | 'bear' | 'pig' | 'owl'

export type DiagramId =
  | 'diamond'
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
  | 'paper-square'
  | 'paper-triangle'
  | 'mouse-ear-left'
  | 'mouse-ears'
  | 'mouse-tips'
  | 'mouse-nose'
  | 'mouse-final'
  | 'frog-eye-left'
  | 'frog-eyes'
  | 'frog-tip-left'
  | 'frog-tips'
  | 'frog-chin'
  | 'frog-final'
  | 'bird-wing'
  | 'bird-beak'
  | 'bird-final'
  | 'rabbit-band'
  | 'rabbit-ear-left'
  | 'rabbit-ears'
  | 'rabbit-chin'
  | 'rabbit-final'
  | 'fox-half'
  | 'fox-ear'
  | 'fox-face'
  | 'fox-final'
  | 'bear-ear-left'
  | 'bear-ears'
  | 'bear-tips'
  | 'bear-chin'
  | 'bear-final'
  | 'pig-sides'
  | 'pig-ear-left'
  | 'pig-ears'
  | 'pig-snout'
  | 'pig-final'
  | 'owl-wings'
  | 'owl-brow'
  | 'owl-beak'
  | 'owl-feet'
  | 'owl-final'

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
  startingDiagram?: DiagramId
  action?: 'Set up' | 'Fold' | 'Draw'
}

export interface AnimalLesson {
  id: AnimalId
  name: string
  tagline: string
  difficulty: 'Easy' | 'Medium'
  minutes: number
  color: string
  strongColor: string
  paperColor: string
  materials?: string
  finishMessage?: string
  steps: FoldStep[]
}

export interface SavedProgress {
  completed: AnimalId[]
  current: Partial<Record<AnimalId, number>>
}
