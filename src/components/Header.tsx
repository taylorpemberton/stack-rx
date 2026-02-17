import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
  const [theme, toggleTheme] = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">StackRx</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Directory</Link>
          <Link to="/quiz" className={`nav-link ${pathname === '/quiz' ? 'active' : ''}`}>Quiz</Link>
          <Link to="/calculator" className={`nav-link ${pathname === '/calculator' ? 'active' : ''}`}>Calculator</Link>
          <Link to="/blog" className={`nav-link ${pathname === '/blog' ? 'active' : ''}`}>Blog</Link>
        </nav>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  );
}
