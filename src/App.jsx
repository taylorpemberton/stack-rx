import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import PeptideDetail from './pages/PeptideDetail';
import { initGA } from './analytics/gtag';
import './index.css';

export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peptide/:id" element={<PeptideDetail />} />
      </Routes>
    </HashRouter>
  );
}
