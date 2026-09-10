import { paperShapes } from '../data/paperShapes'

const finalPaperDiagram = {
  mouse: 'mouse-nose',
  frog: 'frog-chin',
  bird: 'bird-beak',
} as const

export function PaperAnimal({ animal, color }: { animal: keyof typeof finalPaperDiagram; color: string }) {
  return <svg viewBox={animal === 'bird' ? '20 70 260 205' : animal === 'frog' ? '65 105 170 135' : '65 115 170 140'} width="200" height="180">
    <g stroke="#27324a" strokeWidth="3" strokeLinejoin="round">
      {paperShapes[finalPaperDiagram[animal]]!.map((points) => <polygon key={points} points={points} fill={color} />)}
    </g>
    {animal === 'mouse' && <g>
      <path d="M91 151L106 140L101 180ZM209 151L194 140L199 180Z" fill="#d991a0" />
      <g fill="#27324a"><circle cx="126" cy="190" r="5" /><circle cx="174" cy="190" r="5" /></g>
      <path d="M140 241L150 234L160 241Z" fill="#d991a0" />
      <path d="M130 214L108 207M130 221L109 224M170 214L192 207M170 221L191 224" stroke="#27324a" strokeWidth="3" strokeLinecap="round" />
    </g>}
    {animal === 'frog' && <g>
      <g fill="#fffaf0" stroke="#27324a" strokeWidth="2"><circle cx="101" cy="154" r="10" /><circle cx="199" cy="154" r="10" /></g>
      <g fill="#27324a"><circle cx="103" cy="154" r="4" /><circle cx="197" cy="154" r="4" /></g>
      <path d="M123 182Q150 204 177 182" fill="none" stroke="#27324a" strokeWidth="3" strokeLinecap="round" />
      <g fill="#4c9761"><circle cx="112" cy="178" r="4" /><circle cx="188" cy="178" r="4" /></g>
    </g>}
    {animal === 'bird' && <g>
      <path d="M232 155L241 165L232 175Z" fill="#f2b653" />
      <circle cx="222" cy="157" r="4" fill="#27324a" />
      <path d="M148 111L111 163M151 128L129 163M154 146L147 163" stroke="#357f9a" strokeWidth="3" strokeLinecap="round" />
    </g>}
  </svg>
}
