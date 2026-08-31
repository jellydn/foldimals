import * as stylex from '@stylexjs/stylex'
import type { AnimalLesson } from '../types'
import { Button } from '../design-system/Button'
import { Eyebrow } from '../design-system/Eyebrow'
import { AnimalArt } from './AnimalArt'

export function Preview({ lesson, savedStep, onBack, onStart }: { lesson: AnimalLesson; savedStep: number; onBack: () => void; onStart: () => void }) {
  return <main className="preview-page">
    <Button variant="quiet" xstyle={styles.backLink} onClick={onBack}>← All animals</Button>
    <div className="preview-card">
      <div className="preview-art" style={{ background: `${lesson.color}18` }}>
        <AnimalArt animal={lesson.id} color={lesson.paperColor} />
        <span className="preview-sticker">You’ll make this!</span>
      </div>
      <div className="preview-copy">
        <Eyebrow color={lesson.strongColor}>READY TO FOLD?</Eyebrow>
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
        <Button accentColor={lesson.strongColor} fullWidth variant="primary" onClick={onStart}>
          {savedStep > 0 ? `Keep folding — step ${savedStep + 1} →` : 'My paper is ready →'}
        </Button>
      </div>
    </div>
  </main>
}

const styles = stylex.create({
  backLink: {
    marginBlockEnd: 20,
    marginBlockStart: 30,
  },
})
