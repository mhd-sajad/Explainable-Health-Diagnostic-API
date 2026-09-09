import './FeatureImportance.css';

const META = {
  age:            { icon: '👤', label: 'Age' },
  blood_pressure: { icon: '🩸', label: 'Blood Pressure' },
  cholesterol:    { icon: '⚗️', label: 'Cholesterol' },
  max_heart_rate: { icon: '💓', label: 'Max Heart Rate' },
};

export default function FeatureImportance({ result }) {
  const fi = result?.feature_importance;
  const values = fi ? Object.values(fi) : [];
  const maxAbs = values.length ? Math.max(...values.map(Math.abs)) : 1;

  return (
    <section className="fi-section" id="explain">
      <div className="container">
        <div className="fi-header">
          <div className="fi-eyebrow">◆ Step 3</div>
          <h2 className="fi-title">
            Feature <span>Importance</span>
          </h2>
          <p className="fi-subtitle">
            Each feature's contribution to the prediction. Positive values push
            toward High Risk, negative values toward Low Risk.
          </p>
        </div>

        {!fi ? (
          <div className="fi-empty">Run an assessment to see feature contributions</div>
        ) : (
          <>
            {/* Bar chart */}
            <div className="fi-bars">
              {Object.entries(fi).map(([key, val]) => {
                const isPos = val >= 0;
                const pct   = (Math.abs(val) / maxAbs) * 100;
                const meta  = META[key] || { icon: '◆', label: key };
                return (
                  <div className="fi-row" key={key}>
                    <div className="fi-row-label">{meta.label}</div>
                    <div className="fi-bar-track">
                      <div
                        className={`fi-bar-fill ${isPos ? 'positive' : 'negative'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={`fi-row-val ${isPos ? 'positive' : 'negative'}`}>
                      {isPos ? '+' : ''}{val.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cards */}
            <div className="fi-cards">
              {Object.entries(fi).map(([key, val]) => {
                const isPos = val >= 0;
                const meta  = META[key] || { icon: '◆', label: key };
                return (
                  <div className="fi-card" key={key}>
                    <div className="fi-card-icon">{meta.icon}</div>
                    <div className="fi-card-name">{meta.label}</div>
                    <div className={`fi-card-val ${isPos ? 'pos' : 'neg'}`}>
                      {isPos ? '+' : ''}{val.toFixed(2)}
                    </div>
                    <div className={`fi-card-dir ${isPos ? 'pos' : 'neg'}`}>
                      {isPos ? '↑ Increases Risk' : '↓ Reduces Risk'}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
