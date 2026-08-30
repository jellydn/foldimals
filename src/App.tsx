import { useCallback, useEffect, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { Collection } from './components/Collection'
import { Completion } from './components/Completion'
import { FoldingPlayer } from './components/FoldingPlayer'
import { Home } from './components/Home'
import { Preview } from './components/Preview'
import { getLesson, lessons } from './data/lessons'
import { clampStepIndices, completeAnimal, loadProgress, saveProgress } from './storage'
import type { AnimalId } from './types'

type Screen = 'home' | 'preview' | 'player' | 'complete' | 'collection'

function stepCounts(): Partial<Record<AnimalId, number>> {
  return Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson.steps.length]))
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedId, setSelectedId] = useState<AnimalId>('dog')
  const [progress, setProgress] = useState(() => clampStepIndices(loadProgress(), stepCounts()))
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
