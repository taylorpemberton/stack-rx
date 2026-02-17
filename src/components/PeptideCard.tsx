import { Link } from 'react-router-dom';
import StatBar from './StatBar';
import { statLabels } from '../data/peptides';

export default function PeptideCard({ peptide, view }) {
  const topStats = Object.entries(peptide.stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (view === 'list') {
    return (
      <Link to={`/peptide/${peptide.id}`} className="peptide-card list">
        <div className="card-list-left">
          <div className="card-name-row">
            <h3 className="card-name">{peptide.name}</h3>
            <span className="card-category">{peptide.category}</span>
          </div>
          <p className="card-desc">{peptide.description}</p>
        </div>
        <div className="card-list-stats">
          {topStats.map(([key, val]) => (
            <StatBar key={key} label={statLabels[key]} value={val} compact />
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/peptide/${peptide.id}`} className="peptide-card grid">
      <div className="card-header">
        <span className="card-category">{peptide.category}</span>
        <span className={`card-status ${peptide.researchStatus === 'FDA Approved' ? 'approved' : ''}`}>
          {peptide.researchStatus}
        </span>
      </div>
      <h3 className="card-name">{peptide.name}</h3>
      <p className="card-fullname">{peptide.fullName}</p>
      {peptide.eli5 && <p className="card-eli5">{peptide.eli5}</p>}
      {peptide.alsoKnownAs && (
        <div className="card-aka-box">
          <span className="aka-label">AKA</span>
          <span>{peptide.alsoKnownAs.join(', ')}</span>
        </div>
      )}
      <div className="card-stats">
        {topStats.map(([key, val]) => (
          <StatBar key={key} label={statLabels[key]} value={val} compact />
        ))}
      </div>
      <div className="card-benefits">
        {peptide.keyBenefits.slice(0, 2).map((b) => (
          <span key={b} className="benefit-tag">{b}</span>
        ))}
      </div>
      <div className="card-buy-wrapper">
        <button className="card-buy" disabled onClick={(e) => e.preventDefault()}>
          <span className="card-buy-label">Buy</span>
          <span className="card-buy-hover">Coming soon</span>
        </button>
      </div>
    </Link>
  );
}
