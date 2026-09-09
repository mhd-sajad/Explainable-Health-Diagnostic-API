import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Results.css';

export default function Results({ result }) {
  const gaugeRef = useRef(null);

  useEffect(() => {
    if (!result || !gaugeRef.current) return;
    const pct = result.risk_probability / 100;
    const circ = 2 * Math.PI * 54; // r=54
    const offset = circ * (1 - pct);
    gaugeRef.current.style.strokeDashoffset = offset;
  }, [result]);

  if (!result) return null;

  const isHigh = result.risk_assessment === 'High Risk';
  const accent = isHigh ? '#ef4444' : '#22c55e';
  const accentGlow = isHigh ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)';

  return (
    <section id="results" className="results-section">
      <div className="container">
        <AnimatePresence>
          <motion.div
            key={result.record_id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="section-label">📊 Step 2</div>
            <h2 className="section-title">
              Assessment <span className="gradient-text">Results</span>
            </h2>

            <div className="results-grid">
              {/* ── Gauge Card ── */}
              <div className="glass-card result-gauge-card">
                <div className="gauge-wrap">
                  <svg className="gauge-svg" viewBox="0 0 130 130">
                    <circle
                      cx="65" cy="65" r="54"
                      fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"
                    />
                    <circle
                      ref={gaugeRef}
                      cx="65" cy="65" r="54"
                      fill="none"
                      stroke={accent}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54}
                      transform="rotate(-90 65 65)"
                      style={{
                        transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        filter: `drop-shadow(0 0 8px ${accentGlow})`,
                      }}
                    />
                    <text x="65" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter">
                      {result.risk_probability}%
                    </text>
                    <text x="65" y="76" textAnchor="middle" fill={accent} fontSize="9" fontWeight="600" fontFamily="Inter" letterSpacing="1">
                      RISK SCORE
                    </text>
                  </svg>
                </div>

                <div className="gauge-label">
                  <span
                    className={`risk-badge ${isHigh ? 'risk-high' : 'risk-low'}`}
                    style={{ boxShadow: `0 0 20px ${accentGlow}` }}
                  >
                    {isHigh ? '⚠️' : '✅'} {result.risk_assessment}
                  </span>
                </div>

                <div className="record-id-row">
                  <span className="ri-lbl">Record ID</span>
                  <span className="ri-val">{result.record_id.slice(0, 18)}…</span>
                </div>
              </div>

              {/* ── Vitals Summary ── */}
              <div className="glass-card result-vitals-card">
                <h3 className="rv-title">📋 Submitted Vitals</h3>
                <div className="rv-list">
                  {[
                    { icon: '👤', label: 'Age', val: result.vitals.age, unit: 'yrs' },
                    { icon: '🩸', label: 'Blood Pressure', val: result.vitals.blood_pressure, unit: 'mmHg' },
                    { icon: '🧪', label: 'Cholesterol', val: result.vitals.cholesterol, unit: 'mg/dl' },
                    { icon: '💓', label: 'Max Heart Rate', val: result.vitals.max_heart_rate, unit: 'bpm' },
                  ].map((item) => (
                    <div key={item.label} className="rv-item">
                      <span className="rv-icon">{item.icon}</span>
                      <span className="rv-label">{item.label}</span>
                      <span className="rv-value">
                        {item.val} <span className="rv-unit">{item.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rv-interpretation">
                  {isHigh ? (
                    <p className="interp-high">
                      ⚠️ This patient presents a <strong>high probability of cardiac risk</strong>.
                      Immediate clinical evaluation is recommended.
                    </p>
                  ) : (
                    <p className="interp-low">
                      ✅ This patient shows <strong>low cardiac risk indicators</strong>.
                      Continue routine monitoring.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
