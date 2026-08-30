import { isLessonUnlocked, lessons } from '../data/lessons'
import type { AnimalId, SavedProgress } from '../types'
import { AnimalArt } from './AnimalArt'
import { AnimalCard } from './AnimalCard'

export function Home({ progress, onChoose }: { progress: SavedProgress; onChoose: (id: AnimalId) => void }) {
  return <main className="home-page">
    <section className="hero">
      <div>
        <span className="eyebrow">PAPER + IMAGINATION</span>
        <h1>Who will you<br /><em>fold today?</em></h1>
        <p>Pick a friend. We’ll make it together,<br />one easy fold at a time.</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="sun">✦</div>
        <AnimalArt animal="dog" color="#ffc86b" />
        <span className="doodle doodle-one">⌁</span><span className="doodle doodle-two">✧</span>
      </div>
    </section>
    <section className="lesson-section" aria-labelledby="lesson-heading">
      <div className="section-heading">
        <div><span className="eyebrow">YOUR FOLDING PATH</span><h2 id="lesson-heading">Choose an animal</h2></div>
        <p>Start with Dog, then unlock new friends!</p>
      </div>
      <div className="animal-grid">
        {lessons.map((lesson, index) => <AnimalCard
          key={lesson.id}
          lesson={lesson}
          index={index}
          unlocked={isLessonUnlocked(index, progress.completed)}
          completed={progress.completed.includes(lesson.id)}
          savedStep={progress.current[lesson.id] ?? 0}
          onSelect={() => onChoose(lesson.id)}
        />)}
      </div>
    </section>
  </main>
}