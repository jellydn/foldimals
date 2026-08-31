import * as stylex from '@stylexjs/stylex'
import { lessons } from '../data/lessons'
import { ProgressBar } from '../design-system/ProgressBar'
import { colors, radii } from '../design-system/tokens.stylex'
import type { AnimalLesson } from '../types'
import { AnimalArt } from './AnimalArt'

export function AnimalCard({ lesson, index, unlocked, completed, savedStep, onSelect }: {
  lesson: AnimalLesson
  index: number
  unlocked: boolean
  completed: boolean
  savedStep: number
  onSelect: () => void
}) {
  return <button {...stylex.props(styles.card, index === 3 && styles.centeredCard, !unlocked && styles.locked)} onClick={onSelect} disabled={!unlocked} aria-label={`${lesson.name}${unlocked ? '' : ', locked'}`}>
    <div {...stylex.props(styles.bubble)}>{completed ? '✓' : index + 1}</div>
    {!unlocked && <div {...stylex.props(styles.bubble, styles.lockBubble)} aria-hidden="true">🔒</div>}
    <div {...stylex.props(styles.artWrap, styles.tint(lesson.color))}>
      <AnimalArt animal={lesson.id} color={lesson.paperColor} xstyle={styles.art} />
    </div>
    <div {...stylex.props(styles.copy)}>
      <h3 {...stylex.props(styles.title)}>{lesson.name}</h3>
      <p {...stylex.props(styles.tagline)}>{unlocked ? lesson.tagline : `Fold the ${lessons[index - 1].name} to unlock`}</p>
      <div {...stylex.props(styles.meta)}><span>{lesson.difficulty}</span><span>•</span><span>{lesson.minutes} min</span></div>
      {savedStep > 0 && !completed && <ProgressBar color={lesson.color} size="compact" value={(savedStep / lesson.steps.length) * 100} />}
    </div>
    {unlocked && <span {...stylex.props(styles.arrow)} aria-hidden="true">→</span>}
  </button>
}

const styles = stylex.create({
  arrow: {
    bottom: {
      default: 15,
      '@media (max-width: 600px)': 13,
    },
    fontSize: 24,
    fontWeight: 900,
    position: 'absolute',
    right: 18,
  },
  art: {
    height: {
      default: 130,
      '@media (max-width: 600px)': 180,
    },
    width: {
      default: 150,
      '@media (max-width: 600px)': 120,
    },
  },
  artWrap: {
    display: 'grid',
    height: {
      default: 142,
      '@media (max-width: 600px)': '100%',
    },
    minHeight: {
      default: 0,
      '@media (max-width: 600px)': 230,
    },
    placeItems: 'center',
    width: {
      default: '100%',
      '@media (max-width: 600px)': '43%',
    },
  },
  bubble: {
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    display: 'grid',
    fontWeight: 900,
    height: 34,
    left: 12,
    placeItems: 'center',
    position: 'absolute',
    top: 12,
    width: 34,
    zIndex: 2,
  },
  card: {
    alignItems: {
      default: 'stretch',
      '@media (max-width: 600px)': 'center',
    },
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderRadius: radii.large,
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: {
      default: `0 6px 0 ${colors.ink}`,
      ':hover': `0 11px 0 ${colors.ink}`,
    },
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    display: 'flex',
    flexDirection: {
      default: 'column',
      '@media (max-width: 600px)': 'row',
    },
    gridColumn: {
      default: 'span 2',
      '@media (max-width: 820px)': 'span 3',
    },
    minHeight: {
      default: 275,
      '@media (max-width: 600px)': 235,
    },
    overflow: 'hidden',
    paddingBlock: 0,
    paddingInline: 0,
    position: 'relative',
    textAlign: 'left',
    transform: {
      default: 'translateY(0) rotate(0)',
      ':hover': 'translateY(-5px) rotate(-0.4deg)',
      ':disabled': 'none',
    },
    transitionDuration: '200ms',
    transitionProperty: 'transform, box-shadow',
  },
  centeredCard: {
    gridColumn: {
      default: '2 / span 2',
      '@media (max-width: 820px)': 'span 3',
    },
  },
  copy: {
    paddingBlock: 16,
    paddingInline: 18,
    width: {
      default: 'auto',
      '@media (max-width: 600px)': '57%',
    },
  },
  lockBubble: {
    borderColor: '#aaaaaa',
    left: 'auto',
    right: 12,
  },
  locked: {
    borderColor: colors.disabledBorder,
    boxShadow: `0 5px 0 ${colors.disabledBorder}`,
    filter: 'grayscale(0.6)',
  },
  meta: {
    color: colors.mutedText,
    display: 'flex',
    fontSize: 13,
    fontWeight: 800,
    gap: 8,
  },
  tagline: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    minHeight: {
      default: 21,
      '@media (max-width: 600px)': 0,
    },
  },
  tint: (color: string) => ({
    backgroundColor: `${color}18`,
  }),
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
})
