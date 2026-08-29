import { useCallback, useEffect, useState } from 'react'
import { AnimalArt } from './components/AnimalArt'
import { FoldingPlayer } from './components/FoldingPlayer'
import { getLesson, isLessonUnlocked, lessons } from './data/lessons'
import { completeAnimal, loadProgress, saveProgress } from './storage'
import type { AnimalId, AnimalLesson, SavedProgress } from './types'

type Screen = 'home' | 'preview' | 'player' | 'complete' | 'collection'

function AppHeader({ onHome, onCollection, completedCount }: { onHome: () => void; onCollection: () => void; completedCount: number }) {
  return <header className="app-header">
    <button className="wordmark" onClick={onHome} aria-label="Foldimals home">
      <span className="logo-fold">◇</span><span>foldimals</span>
    </button>
    <button className="collection-button" onClick={onCollection}>
      <span aria-hidden="true">🏡</span> My Animals
      {completedCount > 0 && <span className="count-badge">{completedCount}</span>}
    </button>
  </header>
}

function AnimalCard({ lesson, index, unlocked, completed, savedStep, onSelect }: {
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

function Home({ progress, onChoose }: { progress: SavedProgress; onChoose: (id: AnimalId) => void }) {
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

function Preview({ lesson, savedStep, onBack, onStart }: { lesson: AnimalLesson; savedStep: number; onBack: () => void; onStart: () => void }) {
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

function Completion({ lesson, onAnother, onCollection }: { lesson: AnimalLesson; onAnother: () => void; onCollection: () => void }) {
  const [decorated, setDecorated] = useState(false)
  const [photo, setPhoto] = useState<string>()

  const addPhoto = (file?: File) => {
    if (file) setPhoto(URL.createObjectURL(file))
  }

  return <main className="completion-page">
    <div className="confetti" aria-hidden="true">✦ · ★ · ✦</div>
    <span className="eyebrow">YOU MADE IT!</span>
    <h1>Meet your new <em>{lesson.name}!</em></h1>
    <p>You turned one square into a brand-new friend.</p>
    <div className="finished-art" style={{ background: `${lesson.color}16` }}>
      {photo ? <img src={photo} alt={`My finished ${lesson.name}`} /> : <AnimalArt animal={lesson.id} color={lesson.paperColor} decorated={decorated} />}
      <span className="celebration-star star-one">★</span><span className="celebration-star star-two">✦</span>
    </div>
    <div className="decorate-row">
      <button className={decorated ? 'selected' : ''} onClick={() => setDecorated((value) => !value)}>✨ {decorated ? 'Stars added!' : 'Decorate it'}</button>
      <label className="photo-button">📷 {photo ? 'Change photo' : 'Add your photo'}<input type="file" accept="image/*" capture="environment" onChange={(event) => addPhoto(event.target.files?.[0])} /></label>
    </div>
    <div className="reward-note"><span>💛</span><p><strong>{lesson.name} joined My Animals!</strong><br />A new folding friend is waiting for you.</p></div>
    <div className="completion-actions">
      <button className="secondary-button" onClick={onCollection}>See My Animals</button>
      <button className="primary-button" style={{ background: lesson.color }} onClick={onAnother}>Choose another →</button>
    </div>
  </main>
}

function Collection({ progress, onChoose }: { progress: SavedProgress; onChoose: (id: AnimalId) => void }) {
  return <main className="collection-page">
    <span className="eyebrow">YOUR PAPER FRIENDS</span>
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedId, setSelectedId] = useState<AnimalId>('dog')
  const [progress, setProgress] = useState(loadProgress)
  const lesson = getLesson(selectedId) ?? lessons[0]

  useEffect(() => saveProgress(progress), [progress])

  const choose = (id: AnimalId) => { setSelectedId(id); setScreen('preview'); window.scrollTo(0, 0) }
  const updateStep = useCallback((step: number) => {
    setProgress((value) => ({ ...value, current: { ...value.current, [selectedId]: step } }))
  }, [selectedId])
  const finish = () => {
    setProgress((value) => completeAnimal(value, selectedId))
    setScreen('complete')
  }
  const home = () => { setScreen('home'); window.scrollTo(0, 0) }

  if (screen === 'player') return <FoldingPlayer lesson={lesson} initialStep={progress.current[selectedId] ?? 0} onStepChange={updateStep} onExit={() => setScreen('preview')} onComplete={finish} />

  return <div className="app-shell">
    <AppHeader onHome={home} onCollection={() => setScreen('collection')} completedCount={progress.completed.length} />
    {screen === 'home' && <Home progress={progress} onChoose={choose} />}
    {screen === 'preview' && <Preview lesson={lesson} savedStep={progress.current[selectedId] ?? 0} onBack={home} onStart={() => setScreen('player')} />}
    {screen === 'complete' && <Completion lesson={lesson} onAnother={home} onCollection={() => setScreen('collection')} />}
    {screen === 'collection' && <Collection progress={progress} onChoose={choose} />}
  </div>
}
