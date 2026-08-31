import * as stylex from '@stylexjs/stylex'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { StyleXStyles } from '@stylexjs/stylex'
import { colors, radii, shadows, spacing } from './tokens.stylex'

type ButtonStyle = StyleXStyles<{
  flexGrow?: number
  fontSize?: number | string
  justifyContent?: 'center'
  marginBlockEnd?: number | string
  marginBlockStart?: number | string
  minHeight?: number | string
  minWidth?: number | string
  width?: number | string
}>

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  accentColor?: string
  children: ReactNode
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'quiet' | 'icon'
  xstyle?: ButtonStyle
}

export function Button({
  accentColor,
  children,
  fullWidth = false,
  type = 'button',
  variant = 'secondary',
  xstyle,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      {...stylex.props(
        styles.base,
        variants[variant],
        variant === 'primary' && styles.primary,
        variant === 'primary' && accentColor != null && styles.accent(accentColor),
        fullWidth && styles.fullWidth,
        xstyle,
      )}
    >
      {children}
    </button>
  )
}

const styles = stylex.create({
  accent: (accentColor: string) => ({
    backgroundColor: accentColor,
  }),
  base: {
    WebkitTapHighlightColor: 'transparent',
    alignItems: 'center',
    borderColor: colors.ink,
    borderRadius: radii.medium,
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: {
      default: shadows.control,
      ':active': shadows.controlActive,
    },
    color: colors.ink,
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    display: 'inline-flex',
    fontSize: 17,
    fontWeight: 900,
    justifyContent: 'center',
    minHeight: 58,
    opacity: {
      default: 1,
      ':disabled': 0.38,
    },
    outline: {
      default: 'none',
      ':focus-visible': `4px solid ${colors.focus}`,
    },
    outlineOffset: {
      default: 0,
      ':focus-visible': 3,
    },
    paddingBlock: spacing.small,
    paddingInline: spacing.large,
    transform: {
      default: 'translateY(0)',
      ':active': 'translateY(3px)',
    },
  },
  fullWidth: {
    width: '100%',
  },
  icon: {
    borderRadius: '50%',
    fontSize: 21,
    height: {
      default: 52,
      '@media (max-width: 600px)': 44,
    },
    minHeight: 0,
    paddingBlock: 0,
    paddingInline: 0,
    width: {
      default: 52,
      '@media (max-width: 600px)': 44,
    },
  },
  primary: {
    backgroundColor: colors.coral,
    color: colors.surface,
    textShadow: '0 1px 0 rgba(0, 0, 0, 0.15)',
  },
  quiet: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxShadow: 'none',
    minHeight: 44,
    paddingBlock: 0,
    paddingInline: 0,
  },
  secondary: {
    backgroundColor: colors.surface,
  },
})

const variants = {
  icon: styles.icon,
  primary: styles.primary,
  quiet: styles.quiet,
  secondary: styles.secondary,
} as const
