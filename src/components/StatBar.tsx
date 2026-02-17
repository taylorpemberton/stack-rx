export default function StatBar({ label, value, compact = false }) {
  return (
    <div className={`stat-bar ${compact ? 'compact' : ''}`}>
      <div className="stat-bar-header">
        <span className="stat-bar-label">{label}</span>
        <span className="stat-bar-value">{value}</span>
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${value}%` }}
          data-level={value >= 80 ? 'high' : value >= 50 ? 'mid' : 'low'}
        />
      </div>
    </div>
  );
}
