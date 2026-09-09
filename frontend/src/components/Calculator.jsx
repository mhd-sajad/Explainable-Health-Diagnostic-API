import { useState } from 'react';
import { createAssessment } from '../api';
import './Calculator.css';

const fields = [
  { key: 'age',            icon: '👤', label: 'Age',            unit: 'Years', min: 18,  max: 110, step: 1,  default: 55,
    status: v => v < 40 ? ['status-normal','Young'] : v < 60 ? ['status-elevated','Middle-aged'] : ['status-high','Senior'] },
  { key: 'blood_pressure', icon: '🩸', label: 'Blood Pressure', unit: 'mmHg',  min: 70,  max: 250, step: 1,  default: 130,
    status: v => v < 120 ? ['status-normal','Normal'] : v < 140 ? ['status-elevated','Elevated'] : ['status-high','High'] },
  { key: 'cholesterol',    icon: '⚗️', label: 'Cholesterol',    unit: 'mg/dL', min: 100, max: 500, step: 1,  default: 220,
    status: v => v < 200 ? ['status-normal','Desirable'] : v < 240 ? ['status-elevated','Borderline'] : ['status-high','High'] },
  { key: 'max_heart_rate', icon: '💓', label: 'Max Heart Rate', unit: 'BPM',   min: 60,  max: 220, step: 1,  default: 150,
    status: v => v < 100 ? ['status-low','Low'] : v < 160 ? ['status-normal','Average'] : ['status-elevated','High'] },
];

export default function Calculator({ onResult }) {
  const init = Object.fromEntries(fields.map(f => [f.key, f.default]));
  const [vals, setVals] = useState(init);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setVals(v => ({ ...v, [key]: Number(val) }));

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await createAssessment(vals);
      onResult(data);
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      setError('⚠ Failed to connect to the API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="calc-section" id="calculator">
      <div className="container">
        <div className="calc-header">
          <div className="calc-step">◆ Step 1</div>
          <h2 className="calc-title">
            Patient <span>Vitals</span> Input
          </h2>
          <p className="calc-subtitle">
            Adjust the sliders or type values directly. The AI will assess cardiac risk instantly.
          </p>
        </div>

        <div className="calc-grid">
          {fields.map(f => {
            const v = vals[f.key];
            const pct = ((v - f.min) / (f.max - f.min)) * 100;
            const [cls, label] = f.status(v);

            return (
              <div className="calc-card" key={f.key}>
                <div className="calc-card-top">
                  <div className="calc-card-meta">
                    <div className="calc-card-icon">{f.icon}</div>
                    <div className="calc-card-name">{f.label}</div>
                    <div className="calc-card-desc">{f.unit}</div>
                  </div>
                  <div className="calc-card-value-box">
                    <div className="calc-card-num">{v}</div>
                    <div className="calc-card-unit">{f.unit}</div>
                  </div>
                </div>

                <div className="calc-slider-wrap">
                  <div className="calc-slider-track">
                    <div className="calc-slider-fill" style={{ width: `${pct}%` }} />
                    <input
                      type="range"
                      min={f.min} max={f.max} step={f.step}
                      value={v}
                      onChange={e => set(f.key, e.target.value)}
                    />
                  </div>
                </div>

                <div className="calc-slider-range">
                  <span>{f.min}</span>
                  <span>{f.max}</span>
                </div>

                <div className={`calc-status ${cls}`}>
                  <span className="s-dot" />
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="calc-cta">
          <button
            id="submit-assessment-btn"
            className="btn btn-lime"
            onClick={submit}
            disabled={loading}
          >
            {loading ? 'Analysing...' : 'Run AI Assessment →'}
          </button>
          {error && <span className="calc-error">{error}</span>}
        </div>
      </div>
    </section>
  );
}
