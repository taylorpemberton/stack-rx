export default function SyringeVisual({ volumeMl, syringeSize }) {
  const totalUnits = syringeSize * 100;
  const drawUnits = Math.min(volumeMl * 100, totalUnits);
  const fillPercent = Math.min((drawUnits / totalUnits) * 100, 100);

  const majorTicks = syringeSize === 0.3 ? [0, 10, 20, 30]
    : syringeSize === 0.5 ? [0, 10, 20, 30, 40, 50]
    : [0, 20, 40, 60, 80, 100];

  return (
    <div className="syringe-visual">
      <div className="syringe-body">
        <div className="syringe-barrel">
          <div className="syringe-fill" style={{ height: `${fillPercent}%` }} />
          <div className="syringe-ticks">
            {majorTicks.map((tick) => {
              const pos = (tick / totalUnits) * 100;
              return (
                <div
                  key={tick}
                  className="syringe-tick"
                  style={{ bottom: `${pos}%` }}
                >
                  <span className="syringe-tick-label">{tick}</span>
                  <span className="syringe-tick-line" />
                </div>
              );
            })}
          </div>
          {drawUnits > 0 && (
            <div
              className="syringe-draw-line"
              style={{ bottom: `${fillPercent}%` }}
            >
              <span className="syringe-draw-label">
                {drawUnits.toFixed(1)}u
              </span>
            </div>
          )}
        </div>
        <div className="syringe-needle" />
      </div>
    </div>
  );
}
