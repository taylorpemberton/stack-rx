import { useReducer, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import DoseInputs from '../components/DoseInputs';
import DoseResults from '../components/DoseResults';
import TitrationChart from '../components/TitrationChart';
import { dosingData } from '../data/dosing';
import { trackPageView } from '../analytics/gtag';
import { BASE_URL } from '../config';

const initialState = {
  peptideId: '',
  doseLevel: 'clinical',
  bodyWeight: '',
  weightUnit: 'lbs',
  syringeSize: 0.5,
  peptideAmount: '',
  waterVolume: '2',
  frequency: 'daily',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PEPTIDE': {
      const dosing = dosingData[action.value];
      return {
        ...state,
        peptideId: action.value,
        frequency: dosing?.frequency || 'daily',
        peptideAmount: dosing ? String(dosing.vialAmount >= 1000 ? dosing.vialAmount / 1000 : dosing.vialAmount) : '',
      };
    }
    case 'SET_DOSE_LEVEL':
      return { ...state, doseLevel: action.value };
    case 'SET_BODY_WEIGHT':
      return { ...state, bodyWeight: action.value };
    case 'SET_WEIGHT_UNIT':
      return { ...state, weightUnit: action.value };
    case 'SET_SYRINGE':
      return { ...state, syringeSize: action.value };
    case 'SET_PEPTIDE_AMOUNT':
      return { ...state, peptideAmount: action.value };
    case 'SET_WATER_VOLUME':
      return { ...state, waterVolume: action.value };
    case 'SET_FREQUENCY':
      return { ...state, frequency: action.value };
    default:
      return state;
  }
}

export default function Calculator() {
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    trackPageView(location.pathname, 'Dosing Calculator — StackRx');
  }, [location]);

  const dosing = state.peptideId ? dosingData[state.peptideId] : null;

  return (
    <main className="calculator-page">
      <SEO
        title="Dosing Calculator"
        description="Calculate peptide dosing, reconstitution volumes, and titration schedules. Syringe visualization and weekly supply estimates."
        path="/calculator"
        ogImage={`${BASE_URL}/og/calculator.png`}
      />

      <section className="calculator-hero">
        <h1>Dosing Calculator</h1>
        <p className="calculator-subtitle">
          Reconstitution, titration, and syringe volume calculations
        </p>
      </section>

      <div className="calculator-layout">
        <DoseInputs state={state} dispatch={dispatch} />
        <DoseResults state={state} />
      </div>

      {dosing?.titrationWeeks && (
        <div className="calculator-chart-section">
          <TitrationChart
            titrationWeeks={dosing.titrationWeeks}
            unit={dosing.displayUnit}
          />
        </div>
      )}

      <div className="calculator-disclaimer">
        <p>
          This calculator is for educational and research purposes only. It does not constitute medical advice.
          Always consult a qualified healthcare provider before using any peptide.
        </p>
      </div>
    </main>
  );
}
