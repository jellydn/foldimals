import * as stylex from '@stylexjs/stylex'
import { colors, fonts, radii } from '../design-system/tokens.stylex'

export function AppHeader({ onHome, onCollection, completedCount }: { onHome: () => void; onCollection: () => void; completedCount: number }) {
  return <header {...stylex.props(styles.header)}>
    <button {...stylex.props(styles.wordmark, styles.focusRing)} onClick={onHome} aria-label="Foldimals home">
      <span {...stylex.props(styles.logo)}>◇</span><span>foldimals</span>
    </button>
    <button {...stylex.props(styles.collectionButton, styles.focusRing)} onClick={onCollection}>
      <span {...stylex.props(styles.collectionIcon)} aria-hidden="true">🏡</span> My Animals
      {completedCount > 0 && <span {...stylex.props(styles.countBadge)}>{completedCount}</span>}
    </button>
  </header>
}

const styles = stylex.create({
  collectionButton: {
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderRadius: radii.pill,
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: {
      default: `0 3px 0 ${colors.ink}`,
      ':active': `0 1px 0 ${colors.ink}`,
    },
    cursor: 'pointer',
    fontSize: {
      default: 16,
      '@media (max-width: 820px)': 13,
    },
    fontWeight: 800,
    minHeight: 48,
    paddingBlock: {
      default: 8,
      '@media (max-width: 600px)': 6,
    },
    paddingInline: {
      default: 17,
      '@media (max-width: 600px)': 11,
    },
    transform: {
      default: 'translateY(0)',
      ':active': 'translateY(2px)',
    },
  },
  collectionIcon: {
    display: {
      default: 'inline',
      '@media (max-width: 600px)': 'none',
    },
  },
  countBadge: {
    backgroundColor: colors.coral,
    borderRadius: '50%',
    color: colors.surface,
    display: 'inline-grid',
    height: 22,
    marginLeft: 7,
    minWidth: 22,
    paddingInline: 5,
    placeItems: 'center',
  },
  focusRing: {
    outline: {
      default: 'none',
      ':focus-visible': `4px solid ${colors.focus}`,
    },
    outlineOffset: {
      default: 0,
      ':focus-visible': 3,
    },
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(39, 50, 74, 0.08)',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    height: {
      default: 88,
      '@media (max-width: 820px)': 74,
    },
    justifyContent: 'space-between',
    paddingInline: {
      default: 'clamp(24px, 6vw, 90px)',
      '@media (max-width: 820px)': 22,
    },
  },
  logo: {
    backgroundColor: colors.coral,
    borderRadius: 12,
    color: colors.surface,
    display: 'grid',
    fontSize: 30,
    height: {
      default: 39,
      '@media (max-width: 820px)': 34,
    },
    placeItems: 'center',
    transform: 'rotate(-6deg)',
    width: {
      default: 39,
      '@media (max-width: 820px)': 34,
    },
  },
  wordmark: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: fonts.display,
    fontSize: {
      default: 28,
      '@media (max-width: 820px)': 23,
    },
    fontWeight: 700,
    gap: 10,
  },
})
