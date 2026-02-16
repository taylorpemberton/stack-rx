export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${view === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button
        className={`view-btn ${view === 'list' ? 'active' : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
