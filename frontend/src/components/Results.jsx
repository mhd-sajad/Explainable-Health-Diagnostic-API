import './Results.css';

const R = 110;
const CIRC = 2 * Math.PI * R;

export default function Results({ result }) {
  if (!result) {
    return (
      <section className="results-section" id="results">
        <div className="container">
          <div className="results-empty">
            <span className="results-empty-icon">🫀</span>
            <div className="results-empty-text">Run an assessment above to see results</div>
          </div>
        </div>
      </section>
    );
  }

  const pct    = result.risk_probability / 100;
  const offset = CIRC * (1 - pct);
  const isHigh = result.risk_assessment === 'High Risk';
  const gaugeColor = isHigh ? '#000000' : '#1a1a1a';

  const vitals = result.vitals || {};

  return (
    <section className="results-section" id="results">
      <div className="container">
        {/* Gauge */}
        <div className="results-gauge-wrap">
          <svg className="results-gauge-svg" viewBox="0 0 260 260">
            <circle className="gauge-track" cx="130" cy="130" r={R}
              strokeDasharray={CIRC} strokeDashoffset="0"
              transform="rotate(-90 130 130)" />
            <circle className="gauge-fill" cx="130" cy="130" r={R}
              stroke={gaugeColor}
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              transform="rotate(-90 130 130)" />
            <text className="gauge-center-text" x="130" y="122">
              {result.risk_probability}%
            </text>
            <text className="gauge-center-label" x="130" y="148">
              Risk Score
            </text>
          </svg>

          <div className={`results-risk-badge ${isHigh ? '' : 'low-risk'}`}>
            {isHigh ? '⚠' : '✓'} {result.risk_assessment}
          </div>
        </div>

        {/* Details */}
        <div className="results-right">
          <div className="results-eyebrow">◆ Step 2 — Assessment Result</div>
          <h2 className="results-title">
            {isHigh ? 'High\nCardiac\nRisk' : 'Low\nCardiac\nRisk'}
          </h2>

          <div className="results-vitals">
            {[
              ['Age',          vitals.age,            'yrs'],
              ['Blood Pressure',vitals.blood_pressure,'mmHg'],
              ['Cholesterol',  vitals.cholesterol,    'mg/dL'],
              ['Max Heart Rate',vitals.max_heart_rate,'bpm'],
            ].map(([label, val, unit]) => (
              <div className="results-vital-row" key={label}>
                <span className="results-vital-label">{label}</span>
                <span className="results-vital-val">{val} <small>{unit}</small></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
