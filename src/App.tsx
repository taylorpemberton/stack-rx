import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import PeptideDetail from './pages/PeptideDetail';
import { initGA } from './analytics/gtag';
import './index.css';

const Quiz = lazy(() => import('./pages/Quiz'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Blog = lazy(() => import('./pages/Blog'));

export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <>
      <Header />
      <Suspense fallback={<div className="page-loading" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/peptide/:id" element={<PeptideDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Suspense>
    </>
  );
}
