import type { AnimalId } from '../types'

interface AnimalArtProps {
  animal: AnimalId
  color: string
  className?: string
  decorated?: boolean
}

export function AnimalArt({ animal, color, className = '', decorated = false }: AnimalArtProps) {
  const shared = { fill: color, stroke: '#27324a', strokeWidth: 5, strokeLinejoin: 'round' as const }

  return (
    <svg className={className} viewBox="0 0 200 180" role="img" aria-label={`${animal} origami`}>
      {animal === 'dog' && <>
        <path d="M32 35L70 53L100 35L130 53L168 35L153 145L100 168L47 145Z" {...shared} />
        <path d="M32 35L70 53L50 105Z" fill="#e79b48" stroke="#27324a" strokeWidth="5" />
        <path d="M168 35L130 53L150 105Z" fill="#e79b48" stroke="#27324a" strokeWidth="5" />
      </>}
      {animal === 'cat' && <>
        <path d="M38 52L52 20L82 43H118L148 20L162 52L150 145L100 166L50 145Z" {...shared} />
        <path d="M52 20L82 43L53 55Z" fill="#f5c5d8" stroke="#27324a" strokeWidth="4" />
        <path d="M148 20L118 43L147 55Z" fill="#f5c5d8" stroke="#27324a" strokeWidth="4" />
      </>}
      {animal === 'mouse' && <>
        <path d="M25 105L123 48L170 72L147 133L67 142Z" {...shared} />
        <circle cx="142" cy="53" r="31" fill={color} stroke="#27324a" strokeWidth="5" />
        <circle cx="142" cy="53" r="16" fill="#f4b8c6" />
        <path d="M25 105L10 98" stroke="#27324a" strokeWidth="5" strokeLinecap="round" />
      </>}
      {animal === 'frog' && <>
        <path d="M42 54L67 24L92 48H108L133 24L158 54L151 138L100 160L49 138Z" {...shared} />
        <circle cx="72" cy="48" r="18" fill="#fff" stroke="#27324a" strokeWidth="5" />
        <circle cx="128" cy="48" r="18" fill="#fff" stroke="#27324a" strokeWidth="5" />
      </>}
      {animal === 'bird' && <>
        <path d="M29 101L86 40L171 72L119 98L145 150L85 123Z" {...shared} />
        <path d="M86 40L91 119L29 101Z" fill="#58a6de" stroke="#27324a" strokeWidth="5" />
        <path d="M171 72L190 88L165 94Z" fill="#ffc45e" stroke="#27324a" strokeWidth="4" />
      </>}
      <g fill="#27324a">
        {animal === 'mouse' ? <><circle cx="116" cy="84" r="5" /><circle cx="18" cy="100" r="5" /></> :
          animal === 'bird' ? <circle cx="148" cy="76" r="5" /> :
          <><circle cx="79" cy="91" r="6" /><circle cx="121" cy="91" r="6" /></>}
      </g>
      {animal === 'frog' ? <path d="M73 118Q100 137 127 118" fill="none" stroke="#27324a" strokeWidth="5" strokeLinecap="round" /> :
        animal !== 'bird' && animal !== 'mouse' && <>
          <path d="M91 113L100 107L109 113L100 121Z" fill="#27324a" />
          <path d="M80 130Q100 147 120 130" fill="none" stroke="#27324a" strokeWidth="4" strokeLinecap="round" />
        </>}
      {decorated && <g aria-label="star decorations" fill="#fff3a6" stroke="#27324a" strokeWidth="2">
        <path d="M51 75l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" />
        <path d="M145 112l3 6 7 1-5 5 1 7-6-4-6 4 2-7-6-5 7-1z" />
      </g>}
    </svg>
  )
}
