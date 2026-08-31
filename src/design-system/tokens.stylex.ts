import * as stylex from '@stylexjs/stylex'

export const colors = stylex.defineVars({
  canvas: '#fffaf0',
  canvasGlow: '#fff3d7',
  coral: '#ff785f',
  coralStrong: '#e45b49',
  disabledBorder: '#c9c4bc',
  disabledSurface: '#eee8df',
  focus: '#2e8ccf',
  ink: '#27324a',
  line: '#e9dfd0',
  mutedText: '#68758a',
  quietText: '#8993a3',
  surface: '#ffffff',
})

export const fonts = stylex.defineVars({
  body: "'Nunito', system-ui, sans-serif",
  display: "'Fredoka', system-ui, sans-serif",
})

export const radii = stylex.defineVars({
  small: '10px',
  medium: '16px',
  large: '24px',
  pill: '999px',
})

export const shadows = stylex.defineVars({
  control: '0 4px 0 #27324a',
  controlActive: '0 1px 0 #27324a',
})

export const spacing = stylex.defineVars({
  xsmall: '6px',
  small: '10px',
  medium: '16px',
  large: '24px',
  xlarge: '40px',
})
