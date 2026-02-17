import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import PeptideCard from '../components/PeptideCard';
import { quizQuestions } from '../data/quizQuestions';
import { trackPageView, trackEvent } from '../analytics/gtag';
import { BASE_URL } from '../config';

const STEPS = {
  WELCOME: 'welcome',
  QUESTIONS: 'questions',
  EMAIL: 'email',
  RESULTS: 'results',
};

export default function Quiz() {
  const location = useLocation();
  const [step, setStep] = useState(STEPS.QUESTIONS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  // Results stay null until the server returns them — nothing to inspect
  const [results, setResults] = useState(null);

  useEffect(() => {
    trackPageView(location.pathname, 'Peptide Quiz — StackRx');
  }, [location]);

  function handleStart() {
    setStep(STEPS.QUESTIONS);
    trackEvent('quiz_start', 'quiz');
  }

  function handleSelect(questionId, value) {
    const question = quizQuestions[questionIndex];

    if (question.type === 'multi') {
      setAnswers((prev) => {
        const current = prev[questionId] || [];
        const max = question.max || 2;
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) };
        }
        if (current.length >= max) return prev;
        return { ...prev, [questionId]: [...current, value] };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setTimeout(() => advanceQuestion(), 300);
    }
  }

  function advanceQuestion() {
    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Don't compute results here — gate behind email
      setStep(STEPS.EMAIL);
      trackEvent('quiz_complete', 'quiz');
    }
  }

  function handleMultiContinue() {
    const question = quizQuestions[questionIndex];
    const selected = answers[question.id] || [];
    if (selected.length > 0) {
      advanceQuestion();
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setSubmitError('');

    if (!name.trim()) {
      setSubmitError('Name is required');
      return;
    }
    if (!email || !email.includes('@')) {
      setSubmitError('Valid email is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, answers }),
      });
      const data = await res.json();

      if (!res.ok || !data.results) {
        setSubmitError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setResults(data.results);
      setStep(STEPS.RESULTS);
      trackEvent('quiz_email_capture', 'quiz', email);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  const currentQuestion = quizQuestions[questionIndex];
  const progress = step === STEPS.QUESTIONS
    ? ((questionIndex + 1) / quizQuestions.length) * 100
    : step === STEPS.EMAIL ? 90 : step === STEPS.RESULTS ? 100 : 0;

  return (
    <main className="quiz-page">
      <SEO
        title="Peptide Quiz"
        description="Find your stack in 60 seconds. Answer a few questions and get personalized recommendations based on your goals."
        path="/quiz"
        ogImage={`${BASE_URL}/og/quiz.png`}
      />

      {step !== STEPS.WELCOME && (
        <div className="quiz-progress">
          <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="quiz-container">
        {/* Welcome */}
        {step === STEPS.WELCOME && (
          <div className="quiz-welcome">
            <span className="quiz-badge">PEPTIDE QUIZ</span>
            <h1>Find your stack in 60 seconds</h1>
            <p>Answer a few quick questions and we'll recommend the best items for your goals.</p>
            <button className="quiz-start-btn" onClick={handleStart}>
              Get Started
            </button>
          </div>
        )}

        {/* Questions */}
        {step === STEPS.QUESTIONS && currentQuestion && (
          <div className="quiz-question" key={currentQuestion.id}>
            <div className="quiz-step-indicator">
              {questionIndex + 1} of {quizQuestions.length}
            </div>
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.subtitle && (
              <p className="quiz-subtitle">{currentQuestion.subtitle}</p>
            )}
            <div className="quiz-options">
              {currentQuestion.options.map((opt) => {
                const isSelected = currentQuestion.type === 'multi'
                  ? (answers[currentQuestion.id] || []).includes(opt.value)
                  : answers[currentQuestion.id] === opt.value;

                return (
                  <button
                    key={opt.value}
                    className={`quiz-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(currentQuestion.id, opt.value)}
                  >
                    {opt.icon && <span className="quiz-option-icon">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {currentQuestion.type === 'multi' && (
              <button
                className="quiz-continue-btn"
                onClick={handleMultiContinue}
                disabled={!(answers[currentQuestion.id]?.length > 0)}
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Email capture — required, not skippable */}
        {step === STEPS.EMAIL && (
          <div className="quiz-email">
            <div className="quiz-email-preview">
              <div className="quiz-preview-blur" aria-hidden="true">
                <div className="quiz-preview-card" />
                <div className="quiz-preview-card" />
                <div className="quiz-preview-card" />
              </div>
              <div className="quiz-preview-overlay">
                <span className="quiz-preview-lock">🔒</span>
              </div>
            </div>
            <h2>Your results are ready</h2>
            <p>Enter your info below to unlock your personalized recommendations.</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="quiz-email-input"
                required
                autoFocus
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="quiz-email-input"
                required
              />
              {submitError && <p className="quiz-error">{submitError}</p>}
              <button type="submit" className="quiz-start-btn" disabled={submitting}>
                {submitting ? 'Unlocking...' : 'Unlock My Results'}
              </button>
            </form>
            <p className="quiz-privacy">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        )}

        {/* Results — only rendered after server returns data */}
        {step === STEPS.RESULTS && results && (
          <div className="quiz-results">
            <h2>Your Top Peptide Matches</h2>
            <p className="quiz-results-subtitle">Based on your goals and preferences</p>
            <div className="quiz-results-grid">
              {results.map(({ peptide, score }) => (
                <div key={peptide.id} className="quiz-result-card">
                  <PeptideCard peptide={peptide} view="grid" />
                  <div className="quiz-match-score">
                    {Math.round(score)}% match
                  </div>
                </div>
              ))}
            </div>
            <div className="quiz-results-actions">
              <Link to="/" className="quiz-browse-btn">Browse All Peptides</Link>
              <button className="quiz-retake-btn" onClick={() => {
                setStep(STEPS.QUESTIONS);
                setQuestionIndex(0);
                setAnswers({});
                setName('');
                setEmail('');
                setResults(null);
              }}>
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
