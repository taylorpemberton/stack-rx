import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import ViewToggle from '../components/ViewToggle';
import PeptideGrid from '../components/PeptideGrid';
import { peptides } from '../data/peptides';
import { trackPageView } from '../analytics/gtag';

export default function Home() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [view, setView] = useState('grid');
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, 'Peptide Finder — Directory');
  }, [location]);

  function handleToggle(category) {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  const filtered = activeFilters.length === 0
    ? peptides
    : peptides.filter((p) => {
        const categoryFilters = activeFilters.filter((f) => !f.startsWith('_'));
        const specialFilters = activeFilters.filter((f) => f.startsWith('_'));

        const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(p.category);
        const matchesPopular = !specialFilters.includes('_popular') || p.popular;
        const matchesFda = !specialFilters.includes('_fda') || p.researchStatus === 'FDA Approved';

        return matchesCategory && matchesPopular && matchesFda;
      });

  return (
    <main className="home">
      <section className="hero">
        <h1>Peptide Directory</h1>
      </section>
      <div className="toolbar">
        <FilterBar activeFilters={activeFilters} onToggle={handleToggle} />
        <div className="toolbar-right">
          <span className="result-count">{filtered.length} peptides</span>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      <PeptideGrid peptides={filtered} view={view} />
    </main>
  );
}
