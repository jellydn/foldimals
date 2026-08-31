import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

if (import.meta.env.DEV) {
  const stylexStyles = document.createElement('link')
  stylexStyles.rel = 'stylesheet'
  stylexStyles.href = '/virtual:stylex.css'
  document.head.append(stylexStyles)
  void import('virtual:stylex:css-only')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register(new URL('sw.js', document.baseURI)))
}
