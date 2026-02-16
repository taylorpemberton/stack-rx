import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">peptide-finder</span>
        </Link>
        <span className="header-tag">research directory</span>
      </div>
    </header>
  );
}
