import { dosingData } from '../data/dosing';
import { calcConcentration, calcVolumeToDraw, calcWeeklyTotal, calcMonthlyVials, doseToMcg, volumeToUnits } from '../utils/doseCalc';
import SyringeVisual from './SyringeVisual';

export default function DoseResults({ state }) {
  const dosing = state.peptideId ? dosingData[state.peptideId] : null;

  if (!dosing) {
    return (
      <div className="dose-results dose-results-empty">
        <div className="dose-results-placeholder">
          <span className="dose-results-icon">💉</span>
          <p>Select a peptide to see dosing calculations</p>
        </div>
      </div>
    );
  }

  const range = dosing[state.doseLevel];
  const dosePerInjection = range ? (range[0] + range[1]) / 2 : 0;
  const doseInMcg = doseToMcg(dosePerInjection, dosing.unit);

  const concentration = calcConcentration(
    parseFloat(state.peptideAmount) || 0,
    parseFloat(state.waterVolume) || 0
  );
  const volumeToDraw = calcVolumeToDraw(doseInMcg, concentration);
  const units = volumeToUnits(volumeToDraw);

  const weeklyTotal = calcWeeklyTotal(dosePerInjection, state.frequency);
  const weeklyTotalMcg = doseToMcg(weeklyTotal, dosing.unit);
  const vialAmountMcg = doseToMcg(dosing.vialAmount, dosing.unit === 'mcg' ? 'mcg' : 'mg');
  const monthlyVials = calcMonthlyVials(weeklyTotalMcg, vialAmountMcg);

  const formatDose = (val) => {
    if (dosing.unit === 'mg' && val < 1) return `${val.toFixed(2)} ${dosing.displayUnit}`;
    if (dosing.unit === 'mg') return `${val.toFixed(1)} ${dosing.displayUnit}`;
    return `${Math.round(val)} ${dosing.displayUnit}`;
  };

  return (
    <div className="dose-results">
      <div className="dose-result-cards">
        <div className="dose-result-card">
          <span className="dose-result-label">Dose per injection</span>
          <span className="dose-result-value">{formatDose(dosePerInjection)}</span>
          {range && (
            <span className="dose-result-hint">
              Range: {formatDose(range[0])} – {formatDose(range[1])}
            </span>
          )}
        </div>

        <div className="dose-result-card">
          <span className="dose-result-label">Volume to draw</span>
          <span className="dose-result-value">
            {volumeToDraw > 0 ? `${volumeToDraw.toFixed(3)} mL` : '—'}
          </span>
          {units > 0 && (
            <span className="dose-result-hint">{units.toFixed(1)} units on syringe</span>
          )}
        </div>

        <div className="dose-result-card">
          <span className="dose-result-label">Weekly total</span>
          <span className="dose-result-value">{formatDose(weeklyTotal)}</span>
        </div>

        <div className="dose-result-card">
          <span className="dose-result-label">Monthly supply</span>
          <span className="dose-result-value">
            {monthlyVials > 0 ? `${monthlyVials} vial${monthlyVials > 1 ? 's' : ''}` : '—'}
          </span>
          <span className="dose-result-hint">{dosing.commonConcentration}</span>
        </div>
      </div>

      {volumeToDraw > 0 && (
        <SyringeVisual volumeMl={volumeToDraw} syringeSize={state.syringeSize} />
      )}
    </div>
  );
}
