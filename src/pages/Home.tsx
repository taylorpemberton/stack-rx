import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import ViewToggle from '../components/ViewToggle';
import PeptideGrid from '../components/PeptideGrid';
import SEO from '../components/SEO';
import { peptides } from '../data/peptides';
import { trackPageView } from '../analytics/gtag';
import { BASE_URL, SITE_DESCRIPTION } from '../config';

export default function Home() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [view, setView] = useState('grid');
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, 'StackRx — Directory');
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Peptide Research Directory',
    description: SITE_DESCRIPTION,
    numberOfItems: peptides.length,
    itemListElement: peptides.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${BASE_URL}/peptide/${p.id}`,
    })),
  };

  return (
    <main className="home">
      <SEO
        description={SITE_DESCRIPTION}
        path="/"
        jsonLd={jsonLd}
      />
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
