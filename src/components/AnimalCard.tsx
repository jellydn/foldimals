import { lessons } from '../data/lessons'
import type { AnimalLesson } from '../types'
import { AnimalArt } from './AnimalArt'

export function AnimalCard({ lesson, index, unlocked, completed, savedStep, onSelect }: {
  lesson: AnimalLesson
  index: number
  unlocked: boolean
  completed: boolean
  savedStep: number
  onSelect: () => void
}) {
  return <button className={`animal-card ${!unlocked ? 'locked' : ''}`} onClick={onSelect} disabled={!unlocked} aria-label={`${lesson.name}${unlocked ? '' : ', locked'}`}>
    <div className="card-number">{completed ? '✓' : index + 1}</div>
    {!unlocked && <div className="lock-bubble" aria-hidden="true">🔒</div>}
    <div className="animal-art-wrap" style={{ background: `${lesson.color}18` }}>
      <AnimalArt animal={lesson.id} color={lesson.paperColor} />
    </div>
    <div className="card-copy">
      <h3>{lesson.name}</h3>
      <p>{unlocked ? lesson.tagline : `Fold the ${lessons[index - 1].name} to unlock`}</p>
      <div className="card-meta"><span>{lesson.difficulty}</span><span>•</span><span>{lesson.minutes} min</span></div>
      {savedStep > 0 && !completed && <div className="mini-progress"><span style={{ width: `${(savedStep / lesson.steps.length) * 100}%`, background: lesson.color }} /></div>}
    </div>
    {unlocked && <span className="card-arrow" aria-hidden="true">→</span>}
  </button>
}