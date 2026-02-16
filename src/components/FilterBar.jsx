import { categories } from '../data/peptides';

const SPECIAL_FILTERS = [
  { key: '_popular', label: 'Popular', icon: true },
  { key: '_fda', label: 'FDA Approved', icon: false },
];

export default function FilterBar({ activeFilters, onToggle }) {
  return (
    <div className="filter-bar">
      <div className="filter-toggles">
        {SPECIAL_FILTERS.map((sf) => (
          <button
            key={sf.key}
            className={`filter-toggle special ${activeFilters.includes(sf.key) ? 'active' : ''}`}
            onClick={() => onToggle(sf.key)}
          >
            {sf.icon && <span className="filter-star">&#9733;</span>}
            {sf.label}
          </button>
        ))}
        <span className="filter-divider" />
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-toggle ${activeFilters.includes(cat) ? 'active' : ''}`}
            onClick={() => onToggle(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
