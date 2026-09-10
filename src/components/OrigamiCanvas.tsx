import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import { paperShapes } from '../data/paperShapes'
import { colors } from '../design-system/tokens.stylex'
import type { AnimalLesson, DiagramId, FoldStep } from '../types'
import { AnimalArt } from './AnimalArt'
import { Button } from '../design-system/Button'

interface OrigamiCanvasProps {
  lesson: AnimalLesson
  step: FoldStep
  animationKey: number
  slow: boolean
  detailedHelp: boolean
}

const paperStyle = { stroke: '#27324a', strokeWidth: 4, strokeLinejoin: 'round' as const }

function PaperDiagram({ diagram, color }: { diagram: DiagramId; color: string }) {
  const layers = paperShapes[diagram]
  if (layers) return <g>{layers.map((points) => <polygon key={points} points={points} fill={color} {...paperStyle} />)}</g>

  switch (diagram) {
    case 'diamond':
      return <polygon points="150,38 262,150 150,262 38,150" fill={color} {...paperStyle} />
    case 'triangle-down':
      return <polygon points="38,75 262,75 150,245" fill={color} {...paperStyle} />
    case 'triangle-up':
      return <polygon points="38,225 262,225 150,55" fill={color} {...paperStyle} />
    case 'triangle-side':
      return <polygon points="72,38 250,150 72,262" fill={color} {...paperStyle} />
    case 'dog-ear-left':
    case 'dog-ears':
    case 'dog-snout':
      return <g>
        <polygon points="52,78 248,78 150,238" fill={color} {...paperStyle} />
        <polygon points="52,78 98,100 65,190" fill="#e7a752" {...paperStyle} />
        {diagram !== 'dog-ear-left' && <polygon points="248,78 202,100 235,190" fill="#e7a752" {...paperStyle} />}
        {diagram === 'dog-snout' && <polygon points="120,190 180,190 150,238" fill="#f7d28b" {...paperStyle} />}
      </g>
    case 'dog-final':
    case 'cat-final':
    case 'mouse-final':
    case 'frog-final':
    case 'bird-final':
      return null
    case 'cat-ear-left':
    case 'cat-ears':
    case 'cat-head':
      return <g>
        <polygon points="45,220 255,220 150,58" fill={color} {...paperStyle} />
        <polygon points="45,220 96,185 76,82" fill={color} {...paperStyle} />
        {diagram !== 'cat-ear-left' && <polygon points="255,220 204,185 224,82" fill={color} {...paperStyle} />}
        {diagram === 'cat-head' && <polygon points="126,96 174,96 150,58" fill="#9b87ec" {...paperStyle} />}
      </g>
  }
}

const finalDiagrams = new Set<DiagramId>([
  'dog-final', 'cat-final', 'mouse-final', 'frog-final', 'bird-final',
  'rabbit-final', 'fox-final', 'bear-final', 'pig-final', 'owl-final',
])

function isFinalDiagram(diagram: DiagramId): boolean {
  return finalDiagrams.has(diagram)
}

export function OrigamiCanvas({ lesson, step, animationKey, slow, detailedHelp }: OrigamiCanvasProps) {
  const [showResult, setShowResult] = useState(false)
  const [lineStart, lineEnd] = step.guide.line
  const [arrowStart, arrowEnd] = step.guide.arrow
  const isFinal = isFinalDiagram(step.diagram)
  const diagram = !showResult && step.startingDiagram ? step.startingDiagram : step.diagram
  const showGuide = !isFinal && step.action !== 'Set up' && !showResult

  return (
    <div className={`paper-stage ${slow ? 'is-slow' : ''}`}>
      <svg key={animationKey} className="fold-diagram" viewBox="0 0 300 300" role="img" aria-label={`Animated diagram: ${step.instruction}`}>
        <defs>
          <filter id="paper-shadow"><feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity=".15" /></filter>
          <marker id="arrowhead" markerWidth="9" markerHeight="7" refX="7" refY="3.5" orient="auto">
            <polygon points="0 0, 9 3.5, 0 7" fill="#e84c64" />
          </marker>
        </defs>
        <g filter="url(#paper-shadow)" className="paper-motion">
          {isFinal ? <foreignObject x="45" y="45" width="210" height="210"><AnimalArt animal={lesson.id} color={lesson.paperColor} className="final-animal" /></foreignObject> : <PaperDiagram diagram={diagram} color={step.action === 'Set up' || diagram === 'paper-square' ? '#fffaf0' : lesson.paperColor} />}
        </g>
        {showGuide && <g className="fold-guide">
          <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} className={detailedHelp ? 'crease emphasized' : 'crease'} />
          <line x1={arrowStart.x} y1={arrowStart.y} x2={arrowEnd.x} y2={arrowEnd.y} className="direction" markerEnd="url(#arrowhead)" />
          {detailedHelp && step.guide.targets.map((target, index) => <g key={`${target.x}-${target.y}-${index}`} className="target">
            <circle cx={target.x} cy={target.y} r="14" />
            <circle cx={target.x} cy={target.y} r="5" />
          </g>)}
        </g>}
      </svg>
      <span className="stage-label" aria-live="polite">{isFinal ? 'Ta-da!' : step.action === 'Set up' ? 'Colored side down' : showResult ? 'After the fold' : detailedHelp ? 'Match the glowing dots' : 'Watch the arrow'}</span>
      {step.startingDiagram && <div {...stylex.props(styles.shapeControl)}><Button variant="quiet" aria-pressed={showResult} onClick={() => setShowResult((value) => !value)}>{showResult ? 'Show starting shape' : 'Show folded shape'}</Button></div>}
    </div>
  )
}

const styles = stylex.create({
  shapeControl: {
    position: 'absolute',
    top: 8,
    zIndex: 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
})
