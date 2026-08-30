import { useCallback, useEffect, useState } from 'react'
import type { AnimalLesson } from '../types'
import { AnimalArt } from './AnimalArt'

export function Completion({ lesson, onAnother, onCollection }: { lesson: AnimalLesson; onAnother: () => void; onCollection: () => void }) {
  const [decorated, setDecorated] = useState(false)
  const [photo, setPhoto] = useState<string>()

  const addPhoto = useCallback((file?: File) => {
    if (!file) return
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }, [])

  useEffect(() => {
    const url = photo
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [photo])

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