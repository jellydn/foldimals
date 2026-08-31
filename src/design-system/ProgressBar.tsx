import * as stylex from '@stylexjs/stylex'
import { colors, radii } from './tokens.stylex'

interface ProgressBarProps {
  color: string
  label?: string
  size?: 'compact' | 'regular'
  value: number
}

export function ProgressBar({ color, label, size = 'regular', value }: ProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      aria-hidden={label == null ? true : undefined}
      aria-label={label}
      aria-valuemax={label != null ? 100 : undefined}
      aria-valuemin={label != null ? 0 : undefined}
      aria-valuenow={label != null ? normalizedValue : undefined}
      role={label != null ? 'progressbar' : undefined}
      {...stylex.props(styles.track, sizes[size])}
    >
      <span {...stylex.props(styles.fill, styles.progress(normalizedValue, color))} />
    </div>
  )
}

const styles = stylex.create({
  compact: {
    borderWidth: 0,
    height: 5,
    marginTop: 10,
  },
  fill: {
    borderRadius: 'inherit',
    display: 'block',
    height: '100%',
    transitionDuration: '300ms',
    transitionProperty: 'width',
  },
  progress: (value: number, color: string) => ({
    backgroundColor: color,
    width: `${value}%`,
  }),
  regular: {
    height: 10,
  },
  track: {
    backgroundColor: colors.disabledSurface,
    borderColor: colors.line,
    borderRadius: radii.pill,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
})

const sizes = {
  compact: styles.compact,
  regular: styles.regular,
} as const
