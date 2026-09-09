import { useState } from 'react';
import { motion } from 'framer-motion';
import { createAssessment } from '../api';
import './Calculator.css';

const VITALS_CONFIG = [
  {
    key: 'age',
    label: 'Age',
    unit: 'years',
    min: 18, max: 110, default: 55,
    icon: '👤',
    desc: 'Patient age in years',
    color: '#818cf8',
  },
  {
    key: 'blood_pressure',
    label: 'Blood Pressure',
    unit: 'mmHg',
    min: 70, max: 250, default: 130,
    icon: '🩸',
    desc: 'Resting systolic blood pressure',
    color: '#f87171',
  },
  {
    key: 'cholesterol',
    label: 'Cholesterol',
    unit: 'mg/dl',
    min: 100, max: 500, default: 220,
    icon: '🧪',
    desc: 'Serum cholesterol level',
    color: '#fbbf24',
  },
  {
    key: 'max_heart_rate',
    label: 'Max Heart Rate',
    unit: 'bpm',
    min: 60, max: 220, default: 150,
    icon: '💓',
    desc: 'Maximum heart rate achieved',
    color: '#34d399',
  },
];

export default function Calculator({ onResult }) {
  const [vitals, setVitals] = useState({
    age: 55,
    blood_pressure: 130,
    cholesterol: 220,
    max_heart_rate: 150,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSlider = (key, value) => {
    setVitals((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await createAssessment(vitals);
      onResult(data);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="calculator" className="calc-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">🩺 Step 1</div>
          <h2 className="section-title">
            Patient <span className="gradient-text">Vitals Input</span>
          </h2>
          <p className="section-sub">
            Adjust the sliders or type values directly. The AI will assess cardiac risk instantly.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="calc-form" id="vitals-form">
          <div className="vitals-grid">
            {VITALS_CONFIG.map((v, i) => (
              <motion.div
                key={v.key}
                className="vital-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="vital-header">
                  <span className="vital-icon">{v.icon}</span>
                  <div className="vital-meta">
                    <span className="vital-label">{v.label}</span>
                    <span className="vital-desc">{v.desc}</span>
                  </div>
                  <div className="vital-value-wrap">
                    <input
                      id={`input-${v.key}`}
                      type="number"
                      className="vital-num-input"
                      min={v.min}
                      max={v.max}
                      value={vitals[v.key]}
                      onChange={(e) => handleSlider(v.key, e.target.value)}
                    />
                    <span className="vital-unit">{v.unit}</span>
                  </div>
                </div>

                <div className="slider-wrap">
                  <span className="slider-bound">{v.min}</span>
                  <div className="slider-track">
                    <input
                      id={`slider-${v.key}`}
                      type="range"
                      min={v.min}
                      max={v.max}
                      value={vitals[v.key]}
                      onChange={(e) => handleSlider(v.key, e.target.value)}
                      className="vital-slider"
                      style={{ '--accent': v.color, '--pct': `${((vitals[v.key] - v.min) / (v.max - v.min)) * 100}%` }}
                    />
                  </div>
                  <span className="slider-bound">{v.max}</span>
                </div>

                {/* Mini reference bar */}
                <div className="vital-ref">
                  <span style={{ color: v.color, fontSize: '0.7rem' }}>
                    {getVitalStatus(v.key, vitals[v.key])}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {error && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <div className="calc-submit-row">
            <button
              type="submit"
              className="btn-primary submit-btn"
              id="submit-assessment-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <span>🧠</span>
                  Run AI Assessment
                </>
              )}
            </button>
            <div className="submit-hint">
              Results + explainability scores will appear below ↓
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function getVitalStatus(key, val) {
  const map = {
    age: val < 40 ? '✅ Young' : val < 60 ? '⚡ Middle-aged' : '⚠️ Senior',
    blood_pressure: val < 120 ? '✅ Normal' : val < 140 ? '⚡ Elevated' : '⚠️ Hypertension',
    cholesterol: val < 200 ? '✅ Optimal' : val < 240 ? '⚡ Borderline' : '⚠️ High',
    max_heart_rate: val > 160 ? '✅ Excellent' : val > 130 ? '⚡ Average' : '⚠️ Low',
  };
  return map[key] || '';
}
