import * as stylex from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { AnimalId } from '../types'

interface AnimalArtProps {
  animal: AnimalId
  color: string
  className?: string
  decorated?: boolean
  xstyle?: StyleXStyles<{ height?: number | string; width?: number | string }>
}

export function AnimalArt({ animal, color, className = '', decorated = false, xstyle }: AnimalArtProps) {
  const shared = { fill: color, stroke: '#27324a', strokeWidth: 5, strokeLinejoin: 'round' as const }
  const styleProps = stylex.props(xstyle)

  return (
    <svg {...styleProps} className={[className, styleProps.className].filter(Boolean).join(' ')} viewBox="0 0 200 180" role="img" aria-label={`${animal} origami`}>
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
      {animal === 'rabbit' && <>
        <path d="M53 86L48 12L74 20L90 70H110L126 20L152 12L147 86L154 121L128 160H72L46 121Z" {...shared} />
        <path d="M58 29L68 34L79 74L65 66ZM142 29L132 34L121 74L135 66Z" fill="#d986a9" />
        <path d="M50 115L72 120M48 128L71 129M150 115L128 120M152 128L129 129" stroke="#27324a" strokeWidth="3" />
      </>}
      {animal === 'fox' && <>
        <path d="M40 25L80 55H120L160 25L150 105L100 168L50 105Z" {...shared} />
        <path d="M40 25L80 55L57 76ZM160 25L120 55L143 76Z" fill="#92502b" />
        <path d="M50 105L80 97L100 153L120 97L150 105L100 168Z" fill="#fff1db" stroke="#27324a" strokeWidth="4" />
        <path d="M91 153H109L100 166Z" fill="#27324a" />
      </>}
      {animal === 'bear' && <>
        <path d="M40 64L43 30H69L81 56H119L131 30H157L160 64L150 137L128 156H72L50 137Z" {...shared} />
        <path d="M49 41H62L68 59H48ZM151 41H138L132 59H152Z" fill="#f1d4b5" />
        <ellipse cx="100" cy="121" rx="31" ry="26" fill="#f1d4b5" />
      </>}
      {animal === 'pig' && <>
        <path d="M45 56L67 35H133L155 56L150 140L127 160H73L50 140Z" {...shared} />
        <path d="M45 56L73 63L42 99ZM155 56L127 63L158 99Z" fill="#dd8d98" stroke="#27324a" strokeWidth="4" />
        <path d="M73 106H127L119 137H81Z" fill="#e995a2" stroke="#27324a" strokeWidth="4" />
        <circle cx="90" cy="121" r="4" fill="#27324a" /><circle cx="110" cy="121" r="4" fill="#27324a" />
      </>}
      {animal === 'owl' && <>
        <path d="M45 35H155L165 128L138 157H62L35 128Z" {...shared} />
        <path d="M45 35L73 106L35 128ZM155 35L127 106L165 128Z" fill="#9b89c4" stroke="#27324a" strokeWidth="4" />
        <circle cx="77" cy="81" r="25" fill="#fff1db" stroke="#27324a" strokeWidth="4" />
        <circle cx="123" cy="81" r="25" fill="#fff1db" stroke="#27324a" strokeWidth="4" />
        <path d="M45 35H155L113 66H87Z" fill={color} stroke="#27324a" strokeWidth="4" />
        <path d="M90 109H110L100 92Z" fill="#ffc45e" stroke="#27324a" strokeWidth="3" />
      </>}
      <g fill="#27324a">
        {animal === 'mouse' ? <><circle cx="116" cy="84" r="5" /><circle cx="18" cy="100" r="5" /></> :
          animal === 'bird' ? <circle cx="148" cy="76" r="5" /> :
          animal === 'owl' ? <><circle cx="77" cy="81" r="7" /><circle cx="123" cy="81" r="7" /></> :
          <><circle cx="79" cy="91" r="6" /><circle cx="121" cy="91" r="6" /></>}
      </g>
      {animal === 'frog' ? <path d="M73 118Q100 137 127 118" fill="none" stroke="#27324a" strokeWidth="5" strokeLinecap="round" /> :
        (animal === 'dog' || animal === 'cat' || animal === 'rabbit' || animal === 'bear') && <>
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
