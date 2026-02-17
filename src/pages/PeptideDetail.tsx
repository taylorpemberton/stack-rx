import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { peptides, statLabels } from '../data/peptides';
import StatBar from '../components/StatBar';
import SEO from '../components/SEO';
import { trackPageView } from '../analytics/gtag';
import { BASE_URL } from '../config';

export default function PeptideDetail() {
  const { id } = useParams();
  const location = useLocation();
  const peptide = peptides.find((p) => p.id === id);

  useEffect(() => {
    if (peptide) {
      trackPageView(location.pathname, `${peptide.name} — StackRx`);
    }
  }, [location, peptide]);

  if (!peptide) {
    return (
      <main className="detail-page">
        <div className="detail-container">
          <Link to="/" className="back-link">&larr; Back to directory</Link>
          <h1>Peptide not found</h1>
        </div>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalEntity',
    name: peptide.name,
    alternateName: peptide.alsoKnownAs || [],
    description: peptide.description,
    medicineSystem: 'WesternConventional',
    url: `${BASE_URL}/peptide/${peptide.id}`,
  };

  return (
    <main className="detail-page">
      <SEO
        title={peptide.name}
        description={peptide.description}
        path={`/peptide/${peptide.id}`}
        ogImage={`${BASE_URL}/og/${peptide.id}.png`}
        jsonLd={jsonLd}
      />
      <div className="detail-container">
        <Link to="/" className="back-link">&larr; Back to directory</Link>

        <div className="detail-header">
          <div>
            <span className="detail-category">{peptide.category}</span>
            <h1 className="detail-name">{peptide.name}</h1>
            <p className="detail-fullname">{peptide.fullName}</p>
            {peptide.alsoKnownAs && (
              <div className="detail-aka-box">
                <span className="aka-label">AKA</span>
                <span>{peptide.alsoKnownAs.join(', ')}</span>
              </div>
            )}
          </div>
          <span className={`detail-status ${peptide.researchStatus === 'FDA Approved' ? 'approved' : ''}`}>
            {peptide.researchStatus}
          </span>
        </div>

        <p className="detail-description">{peptide.description}</p>

        {peptide.eli5 && (
          <div className="detail-eli5">
            <h2>ELI5</h2>
            <p>{peptide.eli5}</p>
          </div>
        )}

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Performance Profile</h2>
            <div className="detail-stats">
              {Object.entries(peptide.stats).map(([key, val]) => (
                <StatBar key={key} label={statLabels[key]} value={val} />
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Key Benefits</h2>
            <ul className="detail-benefits">
              {peptide.keyBenefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <h2>Properties</h2>
            <dl className="detail-props">
              <div>
                <dt>Sequence</dt>
                <dd className="mono">{peptide.sequence}</dd>
              </div>
              <div>
                <dt>Molecular Weight</dt>
                <dd>{peptide.molecularWeight}</dd>
              </div>
              <div>
                <dt>Administration</dt>
                <dd>{peptide.administration}</dd>
              </div>
              <div>
                <dt>Research Status</dt>
                <dd>{peptide.researchStatus}</dd>
              </div>
            </dl>
          </div>
        </div>

        {peptide.sources && peptide.sources.length > 0 && (
          <div className="detail-sources">
            <h2>Sources</h2>
            <ul>
              {peptide.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.title}
                    <span className="source-arrow">&rarr;</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
