import { peptides } from '../data/peptides';
import { dosingData, doseLabels, frequencyOptions, syringeOptions } from '../data/dosing';

export default function DoseInputs({ state, dispatch }) {
  const availablePeptides = peptides.filter((p) => dosingData[p.id]);
  const dosing = state.peptideId ? dosingData[state.peptideId] : null;

  return (
    <div className="dose-inputs">
      {/* Peptide select */}
      <div className="dose-field">
        <label>Select Peptide</label>
        <select
          value={state.peptideId}
          onChange={(e) => dispatch({ type: 'SET_PEPTIDE', value: e.target.value })}
        >
          <option value="">Choose a peptide...</option>
          {availablePeptides.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Always show all inputs — they just won't compute results until a peptide is picked */}
      {(
        <>
          {/* Dose level */}
          <div className="dose-field">
            <label>Dose Level</label>
            <div className="dose-level-toggle">
              {Object.keys(doseLabels).map((level) => (
                <button
                  key={level}
                  className={`dose-level-btn ${state.doseLevel === level ? 'active' : ''}`}
                  onClick={() => dispatch({ type: 'SET_DOSE_LEVEL', value: level })}
                >
                  {doseLabels[level]}
                </button>
              ))}
            </div>
            {dosing?.[state.doseLevel] && (
              <span className="dose-range-hint">
                Range: {dosing[state.doseLevel][0]}–{dosing[state.doseLevel][1]} {dosing.displayUnit}
              </span>
            )}
          </div>

          {/* Body weight */}
          <div className="dose-field">
            <label>Body Weight</label>
            <div className="dose-input-group">
              <input
                type="number"
                value={state.bodyWeight}
                onChange={(e) => dispatch({ type: 'SET_BODY_WEIGHT', value: e.target.value })}
                placeholder={state.weightUnit === 'kg' ? '70' : '154'}
                min="0"
              />
              <div className="dose-unit-toggle">
                <button
                  className={state.weightUnit === 'kg' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'SET_WEIGHT_UNIT', value: 'kg' })}
                >kg</button>
                <button
                  className={state.weightUnit === 'lbs' ? 'active' : ''}
                  onClick={() => dispatch({ type: 'SET_WEIGHT_UNIT', value: 'lbs' })}
                >lbs</button>
              </div>
            </div>
          </div>

          {/* Syringe size */}
          <div className="dose-field">
            <label>Syringe Size</label>
            <select
              value={state.syringeSize}
              onChange={(e) => dispatch({ type: 'SET_SYRINGE', value: parseFloat(e.target.value) })}
            >
              {syringeOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Reconstitution */}
          <div className="dose-field">
            <label>Reconstitution</label>
            <div className="dose-recon-group">
              <div className="dose-recon-item">
                <span className="dose-recon-label">Peptide amount</span>
                <div className="dose-input-group">
                  <input
                    type="number"
                    value={state.peptideAmount}
                    onChange={(e) => dispatch({ type: 'SET_PEPTIDE_AMOUNT', value: e.target.value })}
                    min="0"
                    step="0.1"
                  />
                  <span className="dose-unit-label">mg</span>
                </div>
              </div>
              <div className="dose-recon-item">
                <span className="dose-recon-label">BAC water</span>
                <div className="dose-input-group">
                  <input
                    type="number"
                    value={state.waterVolume}
                    onChange={(e) => dispatch({ type: 'SET_WATER_VOLUME', value: e.target.value })}
                    min="0"
                    step="0.1"
                  />
                  <span className="dose-unit-label">mL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="dose-field">
            <label>Frequency</label>
            <select
              value={state.frequency}
              onChange={(e) => dispatch({ type: 'SET_FREQUENCY', value: e.target.value })}
            >
              {frequencyOptions.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
