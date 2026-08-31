import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors } from './tokens.stylex'

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <span {...stylex.props(styles.root, color != null && styles.color(color))}>{children}</span>
}

const styles = stylex.create({
  color: (color: string) => ({ color }),
  root: {
    color: colors.coralStrong,
    display: 'inline-block',
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: '0.15em',
    marginBottom: 12,
  },
})
