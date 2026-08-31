import * as stylex from '@stylexjs/stylex'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../design-system/Button'
import { Eyebrow } from '../design-system/Eyebrow'
import type { AnimalLesson } from '../types'
import { AnimalArt } from './AnimalArt'

export function Completion({ lesson, onAnother, onCollection }: { lesson: AnimalLesson; onAnother: () => void; onCollection: () => void }) {
  const [decorated, setDecorated] = useState(false)
  const [photo, setPhoto] = useState<string>()
  const photoUrl = useRef<string | undefined>(undefined)

  const addPhoto = useCallback((file?: File) => {
    if (!file) return
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current)
    photoUrl.current = URL.createObjectURL(file)
    setPhoto(photoUrl.current)
  }, [])

  useEffect(() => {
    return () => {
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current)
    }
  }, [])

  return <main className="completion-page">
    <div className="confetti" aria-hidden="true">✦ · ★ · ✦</div>
    <Eyebrow>YOU MADE IT!</Eyebrow>
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
      <Button xstyle={styles.action} onClick={onCollection}>See My Animals</Button>
      <Button accentColor={lesson.color} variant="primary" xstyle={styles.action} onClick={onAnother}>Choose another →</Button>
    </div>
  </main>
}

const styles = stylex.create({
  action: {
    justifyContent: 'center',
    minHeight: {
      default: 58,
      '@media (min-width: 601px) and (max-height: 850px)': 52,
    },
    width: {
      default: 'auto',
      '@media (max-width: 600px)': '100%',
    },
  },
})
