import type { AnimalLesson } from '../types'
import { AnimalArt } from './AnimalArt'

export function Preview({ lesson, savedStep, onBack, onStart }: { lesson: AnimalLesson; savedStep: number; onBack: () => void; onStart: () => void }) {
  return <main className="preview-page">
    <button className="back-link" onClick={onBack}>← All animals</button>
    <div className="preview-card">
      <div className="preview-art" style={{ background: `${lesson.color}18` }}>
        <AnimalArt animal={lesson.id} color={lesson.paperColor} />
        <span className="preview-sticker">You’ll make this!</span>
      </div>
      <div className="preview-copy">
        <span className="eyebrow" style={{ color: lesson.color }}>READY TO FOLD?</span>
        <h1>{lesson.name}</h1>
        <p className="tagline">{lesson.tagline}</p>
        <div className="lesson-facts">
          <span>⏱ <strong>{lesson.minutes} minutes</strong></span>
          <span>◇ <strong>{lesson.steps.length} folds</strong></span>
          <span>☀ <strong>{lesson.difficulty}</strong></span>
        </div>
        <div className="ready-box">
          <div className="paper-icon" aria-hidden="true">◇</div>
          <div><h2>Grab one square paper</h2><p>Any color, about the size of your hand.</p></div>
          <span className="ready-check" aria-hidden="true">✓</span>
        </div>
        <div className="calm-note"><span aria-hidden="true">💛</span><p><strong>No rush.</strong> You can replay every fold or ask for extra help.</p></div>
        <button className="primary-button wide" style={{ background: lesson.color }} onClick={onStart}>
          {savedStep > 0 ? `Keep folding — step ${savedStep + 1} →` : 'My paper is ready →'}
        </button>
      </div>
    </div>
  </main>
}