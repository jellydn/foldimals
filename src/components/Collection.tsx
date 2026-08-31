import { getLesson } from '../data/lessons'
import { Eyebrow } from '../design-system/Eyebrow'
import type { AnimalId, SavedProgress } from '../types'
import { AnimalArt } from './AnimalArt'

export function Collection({ progress, onChoose }: { progress: SavedProgress; onChoose: (id: AnimalId) => void }) {
  return <main className="collection-page">
    <Eyebrow>YOUR PAPER FRIENDS</Eyebrow>
    <h1>My Animals</h1>
    <p>Every friend here started as one little square.</p>
    {progress.completed.length === 0 ? <div className="empty-collection"><span>◇</span><h2>Your shelf is ready!</h2><p>Fold your first animal and it will live here.</p></div> :
      <div className="collection-grid">{progress.completed.map((id) => {
        const lesson = getLesson(id)
        if (!lesson) return null
        return <button key={id} onClick={() => onChoose(id)} style={{ background: `${lesson.color}18` }}>
          <span className="made-badge">Made ✓</span><AnimalArt animal={id} color={lesson.paperColor} /><h2>{lesson.name}</h2><span>Fold again →</span>
        </button>
      })}</div>}
  </main>
}
