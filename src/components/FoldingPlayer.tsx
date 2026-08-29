import { useEffect, useState } from 'react'
import type { AnimalLesson } from '../types'
import { OrigamiCanvas } from './OrigamiCanvas'

interface FoldingPlayerProps {
  lesson: AnimalLesson
  initialStep: number
  onStepChange: (step: number) => void
  onExit: () => void
  onComplete: () => void
}

export function FoldingPlayer({ lesson, initialStep, onStepChange, onExit, onComplete }: FoldingPlayerProps) {
  const [stepIndex, setStepIndex] = useState(Math.min(initialStep, lesson.steps.length - 1))
  const [animationKey, setAnimationKey] = useState(0)
  const [helpLevel, setHelpLevel] = useState(0)
  const step = lesson.steps[stepIndex]

  useEffect(() => {
    onStepChange(stepIndex)
  }, [stepIndex, onStepChange])

  const replay = () => setAnimationKey((key) => key + 1)
  const askForHelp = () => {
    setHelpLevel((level) => Math.min(level + 1, 2))
    replay()
  }
  const goToStep = (index: number) => {
    setStepIndex(index)
    setHelpLevel(0)
    replay()
  }
  const next = () => {
    if (stepIndex === lesson.steps.length - 1) onComplete()
    else goToStep(stepIndex + 1)
  }

  return <main className="player-page">
    <header className="player-header">
      <button className="icon-button" onClick={onExit} aria-label="Leave lesson">✕</button>
      <div className="player-progress" aria-label={`Step ${stepIndex + 1} of ${lesson.steps.length}`}>
        <span>Step {stepIndex + 1} of {lesson.steps.length}</span>
        <div className="progress-track"><div style={{ width: `${((stepIndex + 1) / lesson.steps.length) * 100}%`, background: lesson.color }} /></div>
      </div>
      <button className="icon-button replay-button" onClick={replay} aria-label="Replay animation">↻</button>
    </header>

    <section className="player-layout">
      <OrigamiCanvas lesson={lesson} step={step} animationKey={animationKey} slow={helpLevel > 0} detailedHelp={helpLevel > 1} />
      <div className="instruction-panel" aria-live="polite">
        <span className="action-chip" style={{ background: `${lesson.color}22`, color: lesson.color }}>ONE FOLD</span>
        <h1>{step.instruction}</h1>
        {helpLevel > 1 && <div className="hint-box"><span aria-hidden="true">💡</span><p><strong>Try this:</strong> {step.hint}</p></div>}
        <button className={`help-button ${helpLevel ? 'active' : ''}`} onClick={askForHelp}>
          <span aria-hidden="true">{helpLevel > 1 ? '✨' : '👋'}</span>
          {helpLevel === 0 ? 'I need help' : helpLevel === 1 ? 'Show me more help' : 'Replay extra help'}
        </button>
      </div>
    </section>

    <footer className="player-controls">
      <button className="secondary-button" disabled={stepIndex === 0} onClick={() => goToStep(stepIndex - 1)}>← Previous</button>
      <button className="primary-button" style={{ background: lesson.color }} onClick={next}>
        {stepIndex === lesson.steps.length - 1 ? 'I did it! 🎉' : 'Next fold →'}
      </button>
    </footer>
  </main>
}
