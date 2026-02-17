import PeptideCard from './PeptideCard';

export default function PeptideGrid({ peptides, view }) {
  if (peptides.length === 0) {
    return (
      <div className="empty-state">
        <p>No peptides match the selected filters.</p>
      </div>
    );
  }

  return (
    <div className={`peptide-grid ${view}`}>
      {peptides.map((p) => (
        <PeptideCard key={p.id} peptide={p} view={view} />
      ))}
    </div>
  );
}
