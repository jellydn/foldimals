import type { ReactNode } from 'react'
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

type Shape = { kind: 'none' } | { kind: 'polygon'; points: string; fill?: string } | { kind: 'rect'; x: string; y: string; w: string; h: string } | { kind: 'circle'; cx: number; cy: number; r: number; fill?: string } | { kind: 'group'; shapes: Shape[] }

function diagramShapes(diagram: DiagramId): Shape {
  const build = (shapes: Shape[]) => ({ kind: 'group' as const, shapes })
  const polygon = (points: string, fill?: string) => ({ kind: 'polygon' as const, points, fill })

  switch (diagram) {
    case 'diamond':
      return polygon('150,38 262,150 150,262 38,150')
    case 'square-cross':
      return polygon('150,38 262,150 150,262 38,150')
    case 'rectangle':
      return { kind: 'rect', x: '75', y: '38', w: '150', h: '224' }
    case 'triangle-down':
      return polygon('38,75 262,75 150,245')
    case 'triangle-up':
      return polygon('38,225 262,225 150,55')
    case 'triangle-side':
      return polygon('72,38 250,150 72,262')
    case 'dog-ear-left':
      return build([
        polygon('52,78 248,78 150,238'),
        polygon('52,78 98,100 65,190', '#e7a752'),
      ])
    case 'dog-ears':
      return build([
        polygon('52,78 248,78 150,238'),
        polygon('52,78 98,100 65,190', '#e7a752'),
        polygon('248,78 202,100 235,190', '#e7a752'),
      ])
    case 'dog-snout':
      return build([
        polygon('52,78 248,78 150,238'),
        polygon('52,78 98,100 65,190', '#e7a752'),
        polygon('248,78 202,100 235,190', '#e7a752'),
        polygon('120,190 180,190 150,238', '#f7d28b'),
      ])
    case 'dog-final':
    case 'cat-final':
    case 'mouse-final':
    case 'frog-final':
    case 'bird-final':
      return { kind: 'none' }
    case 'cat-ear-left':
      return build([
        polygon('45,220 255,220 150,58'),
        polygon('45,220 96,185 76,82'),
      ])
    case 'cat-ears':
      return build([
        polygon('45,220 255,220 150,58'),
        polygon('45,220 96,185 76,82'),
        polygon('255,220 204,185 224,82'),
      ])
    case 'cat-head':
      return build([
        polygon('45,220 255,220 150,58'),
        polygon('45,220 96,185 76,82'),
        polygon('255,220 204,185 224,82'),
        polygon('126,96 174,96 150,58', '#9b87ec'),
      ])
    case 'mouse-kite-top':
      return build([polygon('45,150 235,62 235,238')])
    case 'mouse-kite':
      return build([
        polygon('45,150 235,62 235,238'),
        polygon('45,150 208,110 208,190', '#70c5b5'),
      ])
    case 'mouse-ear':
      return build([
        polygon('45,150 235,62 235,238'),
        polygon('45,150 208,110 208,190', '#70c5b5'),
        { kind: 'circle', cx: 210, cy: 150, r: 35, fill: '#f5b9c8' },
      ])
    case 'mouse-nose':
      return build([
        polygon('45,150 235,62 235,238'),
        polygon('45,150 208,110 208,190', '#70c5b5'),
        { kind: 'circle', cx: 210, cy: 150, r: 35, fill: '#f5b9c8' },
      ])
    case 'frog-roof':
      return build([
        { kind: 'rect', x: '55', y: '82', w: '190', h: '150' },
        polygon('55,82 150,35 245,82 150,148', '#b9e874'),
      ])
    case 'frog-triangle':
      return build([
        { kind: 'rect', x: '55', y: '82', w: '190', h: '150' },
        polygon('55,82 150,35 245,82 150,148', '#b9e874'),
      ])
    case 'frog-body':
      return build([
        { kind: 'rect', x: '55', y: '82', w: '190', h: '150' },
        polygon('55,82 150,35 245,82 150,148', '#b9e874'),
      ])
    case 'frog-side-left':
      return build([
        { kind: 'rect', x: '55', y: '82', w: '190', h: '150' },
        polygon('55,82 150,35 245,82 150,148', '#b9e874'),
        polygon('55,150 105,122 105,232 55,232', '#83bc46'),
      ])
    case 'frog-sides':
      return build([
        { kind: 'rect', x: '55', y: '82', w: '190', h: '150' },
        polygon('55,82 150,35 245,82 150,148', '#b9e874'),
        polygon('55,150 105,122 105,232 55,232', '#83bc46'),
        polygon('245,150 195,122 195,232 245,232', '#83bc46'),
      ])
    case 'bird-kite':
      return build([polygon('150,35 242,150 150,265 58,150')])
    case 'bird-diamond':
      return build([
        polygon('150,35 242,150 150,265 58,150'),
        polygon('58,150 150,80 242,150 150,220', '#6aaee1'),
      ])
    case 'bird-wing-one':
      return build([
        polygon('150,35 242,150 150,265 58,150'),
        polygon('58,150 150,80 242,150 150,220', '#6aaee1'),
        polygon('150,80 96,205 150,175', '#4a92ce'),
      ])
    case 'bird-wings':
      return build([
        polygon('150,35 242,150 150,265 58,150'),
        polygon('58,150 150,80 242,150 150,220', '#6aaee1'),
        polygon('150,80 96,205 150,175', '#4a92ce'),
        polygon('150,80 204,205 150,175', '#91c8ed'),
      ])
    case 'bird-head':
    case 'bird-beak':
      return build([
        polygon('150,35 242,150 150,265 58,150'),
        polygon('58,150 150,80 242,150 150,220', '#6aaee1'),
        polygon('150,80 96,205 150,175', '#4a92ce'),
        polygon('150,80 204,205 150,175', '#91c8ed'),
      ])
  }
}

function isFinalDiagram(diagram: DiagramId): boolean {
  return diagram.endsWith('final')
}

function PaperDiagram({ diagram, color }: { diagram: DiagramId; color: string }) {
  if (isFinalDiagram(diagram)) return null

  const shapes = diagramShapes(diagram)

  const renderShapes = (group: Shape): ReactNode => {
    switch (group.kind) {
      case 'none':
        return null
      case 'polygon':
        return <polygon points={group.points} fill={group.fill ?? color} {...paperStyle} />
      case 'rect':
        return <rect x={group.x} y={group.y} width={group.w} height={group.h} rx="2" fill={color} {...paperStyle} />
      case 'circle':
        return <circle cx={group.cx} cy={group.cy} r={group.r} fill={group.fill ?? color} {...paperStyle} />
      case 'group':
        return <g>{group.shapes.map((shape, index) => <g key={index}>{renderShapes(shape)}</g>)}</g>
    }
  }

  return renderShapes(shapes)
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