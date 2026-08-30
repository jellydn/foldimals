export function AppHeader({ onHome, onCollection, completedCount }: { onHome: () => void; onCollection: () => void; completedCount: number }) {
  return <header className="app-header">
    <button className="wordmark" onClick={onHome} aria-label="Foldimals home">
      <span className="logo-fold">◇</span><span>foldimals</span>
    </button>
    <button className="collection-button" onClick={onCollection}>
      <span aria-hidden="true">🏡</span> My Animals
      {completedCount > 0 && <span className="count-badge">{completedCount}</span>}
    </button>
  </header>
}