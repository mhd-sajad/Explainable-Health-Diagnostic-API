import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import './FeatureImportance.css';

const FEATURE_META = {
  age:            { label: 'Age',           icon: '👤', unit: 'yrs' },
  blood_pressure: { label: 'Blood Pressure', icon: '🩸', unit: 'mmHg' },
  cholesterol:    { label: 'Cholesterol',    icon: '🧪', unit: 'mg/dl' },
  max_heart_rate: { label: 'Max Heart Rate', icon: '💓', unit: 'bpm' },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const isPos = d.value >= 0;
  return (
    <div className="fi-tooltip">
      <div className="fit-name">{d.payload.label}</div>
      <div className={`fit-val ${isPos ? 'pos' : 'neg'}`}>
        {isPos ? '+' : ''}{d.value.toFixed(4)}
      </div>
      <div className="fit-desc">
        {isPos ? '↑ Increases risk' : '↓ Decreases risk'}
      </div>
    </div>
  );
};

export default function FeatureImportance({ result }) {
  if (!result?.feature_importance) return null;

  const data = Object.entries(result.feature_importance).map(([key, val]) => ({
    key,
    label: FEATURE_META[key]?.label ?? key,
    icon: FEATURE_META[key]?.icon ?? '📊',
    value: val,
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)));

  return (
    <section id="importance" className="fi-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">🔍 Step 3</div>
          <h2 className="section-title">
            Explainability & <span className="gradient-text">Feature Importance</span>
          </h2>
          <p className="section-sub">
            Each feature's contribution to the prediction is shown below. Positive values
            <strong style={{ color: '#f87171' }}> increase risk</strong>; negative values
            <strong style={{ color: '#4ade80' }}> decrease risk</strong>.
          </p>
        </motion.div>

        <AnimatePresence>
          <motion.div
            key={result.record_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="fi-content"
          >
            {/* Bar Chart */}
            <div className="glass-card fi-chart-card">
              <h3 className="fi-card-title">📊 Contribution Bar Chart</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {data.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={entry.value >= 0 ? '#ef4444' : '#22c55e'}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detail cards */}
            <div className="fi-cards-grid">
              {data.map((item, i) => {
                const isPos = item.value >= 0;
                const barWidth = (Math.abs(item.value) / maxAbs) * 100;
                return (
                  <motion.div
                    key={item.key}
                    className="glass-card fi-detail-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="fid-top">
                      <span className="fid-icon">{item.icon}</span>
                      <div className="fid-info">
                        <span className="fid-label">{item.label}</span>
                        <span className="fid-key">{item.key}</span>
                      </div>
                      <span className={`fid-val ${isPos ? 'pos' : 'neg'}`}>
                        {isPos ? '+' : ''}{item.value.toFixed(4)}
                      </span>
                    </div>

                    <div className="fid-bar-track">
                      <motion.div
                        className={`fid-bar ${isPos ? 'bar-pos' : 'bar-neg'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${barWidth}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="fid-impact">
                      {isPos
                        ? <span className="impact-high">↑ Pushes toward High Risk</span>
                        : <span className="impact-low">↓ Pushes toward Low Risk</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Explainability note */}
            <div className="fi-note glass-card">
              <span className="fi-note-icon">💡</span>
              <p>
                <strong>How this works:</strong> Each score is computed as{' '}
                <code>coefficient × feature_value</code> from the logistic regression model.
                Larger absolute values indicate stronger influence on the final prediction.
                This is a form of{' '}
                <strong>linear model explainability</strong> — fully transparent and auditable.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
