import type { AnimalLesson, DiagramId, FoldStep } from '../types'
import { AnimalArt } from './AnimalArt'

interface OrigamiCanvasProps {
  lesson: AnimalLesson
  step: FoldStep
  animationKey: number
  slow: boolean
  detailedHelp: boolean
}

const paperStyle = { stroke: '#27324a', strokeWidth: 4, strokeLinejoin: 'round' as const }

function PaperDiagram({ diagram, color }: { diagram: DiagramId; color: string }) {
  switch (diagram) {
    case 'diamond':
    case 'square-cross':
      return <polygon points="150,38 262,150 150,262 38,150" fill={color} {...paperStyle} />
    case 'rectangle':
      return <rect x="75" y="38" width="150" height="224" rx="2" fill={color} {...paperStyle} />
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
    case 'mouse-kite-top':
    case 'mouse-kite':
    case 'mouse-ear':
    case 'mouse-nose':
      return <g>
        <polygon points="45,150 235,62 235,238" fill={color} {...paperStyle} />
        {diagram !== 'mouse-kite-top' && <polygon points="45,150 208,110 208,190" fill="#70c5b5" {...paperStyle} />}
        {(diagram === 'mouse-ear' || diagram === 'mouse-nose') && <circle cx="210" cy="150" r="35" fill="#f5b9c8" {...paperStyle} />}
      </g>
    case 'frog-roof':
    case 'frog-triangle':
    case 'frog-body':
    case 'frog-side-left':
    case 'frog-sides':
      return <g>
        <rect x="55" y="82" width="190" height="150" fill={color} {...paperStyle} />
        <polygon points="55,82 150,35 245,82 150,148" fill="#b9e874" {...paperStyle} />
        {(diagram === 'frog-side-left' || diagram === 'frog-sides') && <polygon points="55,150 105,122 105,232 55,232" fill="#83bc46" {...paperStyle} />}
        {diagram === 'frog-sides' && <polygon points="245,150 195,122 195,232 245,232" fill="#83bc46" {...paperStyle} />}
      </g>
    case 'bird-kite':
    case 'bird-diamond':
    case 'bird-wing-one':
    case 'bird-wings':
    case 'bird-head':
    case 'bird-beak':
      return <g>
        <polygon points="150,35 242,150 150,265 58,150" fill={color} {...paperStyle} />
        {diagram !== 'bird-kite' && <polygon points="58,150 150,80 242,150 150,220" fill="#6aaee1" {...paperStyle} />}
        {diagram !== 'bird-kite' && diagram !== 'bird-diamond' && <polygon points="150,80 96,205 150,175" fill="#4a92ce" {...paperStyle} />}
        {(diagram === 'bird-wings' || diagram === 'bird-head' || diagram === 'bird-beak') && <polygon points="150,80 204,205 150,175" fill="#91c8ed" {...paperStyle} />}
      </g>
  }
}

const finalDiagrams = new Set<DiagramId>(['dog-final', 'cat-final', 'mouse-final', 'frog-final', 'bird-final'])

function isFinalDiagram(diagram: DiagramId): boolean {
  return finalDiagrams.has(diagram)
}

export function OrigamiCanvas({ lesson, step, animationKey, slow, detailedHelp }: OrigamiCanvasProps) {
  const [lineStart, lineEnd] = step.guide.line
  const [arrowStart, arrowEnd] = step.guide.arrow
  const isFinal = isFinalDiagram(step.diagram)

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
          {isFinal ? <foreignObject x="45" y="45" width="210" height="210"><AnimalArt animal={lesson.id} color={lesson.paperColor} className="final-animal" /></foreignObject> : <PaperDiagram diagram={step.diagram} color={lesson.paperColor} />}
        </g>
        {!isFinal && <g className="fold-guide">
          <line x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} className={detailedHelp ? 'crease emphasized' : 'crease'} />
          <line x1={arrowStart.x} y1={arrowStart.y} x2={arrowEnd.x} y2={arrowEnd.y} className="direction" markerEnd="url(#arrowhead)" />
          {detailedHelp && step.guide.targets.map((target, index) => <g key={`${target.x}-${target.y}-${index}`} className="target">
            <circle cx={target.x} cy={target.y} r="14" />
            <circle cx={target.x} cy={target.y} r="5" />
          </g>)}
        </g>}
      </svg>
      <span className="stage-label">{isFinal ? 'Ta-da!' : detailedHelp ? 'Match the glowing dots' : 'Watch the arrow'}</span>
    </div>
  )
}
