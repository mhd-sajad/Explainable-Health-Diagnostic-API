import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAssessments, deleteAssessment } from '../api';
import './History.css';

export default function History({ refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await getAllAssessments();
      setRecords(data.reverse()); // newest first
    } catch {
      // API might not be ready yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await deleteAssessment(id);
      setRecords((prev) => prev.filter((r) => r.record_id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="history" className="history-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">📁 Step 4</div>
          <h2 className="section-title">
            Assessment <span className="gradient-text">History</span>
          </h2>
          <p className="section-sub">
            All assessments from this session. Records are stored in-memory and will
            reset on server restart.
          </p>
        </motion.div>

        <div className="history-toolbar">
          <button
            className="btn-primary history-refresh-btn"
            id="refresh-history-btn"
            onClick={fetchRecords}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : '🔄'}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <span className="history-count">
            {records.length} record{records.length !== 1 ? 's' : ''}
          </span>
        </div>

        {records.length === 0 && !loading && (
          <div className="history-empty">
            <span className="empty-icon">📋</span>
            <p>No assessments yet. Run your first assessment above!</p>
          </div>
        )}

        <div className="history-list">
          <AnimatePresence>
            {records.map((record, i) => {
              const isHigh = record.risk_assessment === 'High Risk';
              return (
                <motion.div
                  key={record.record_id}
                  className="glass-card history-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  layout
                >
                  <div className="hi-left">
                    <span className={`hi-indicator ${isHigh ? 'ind-high' : 'ind-low'}`} />
                    <div className="hi-meta">
                      <span className="hi-id">#{record.record_id.slice(0, 8)}</span>
                      <span className={`badge ${isHigh ? 'badge-high' : 'badge-low'}`}>
                        {record.risk_assessment}
                      </span>
                    </div>
                  </div>

                  <div className="hi-vitals">
                    <span className="hiv">👤 {record.vitals.age}y</span>
                    <span className="hiv">🩸 {record.vitals.blood_pressure} mmHg</span>
                    <span className="hiv">🧪 {record.vitals.cholesterol} mg/dl</span>
                    <span className="hiv">💓 {record.vitals.max_heart_rate} bpm</span>
                  </div>

                  <div className="hi-prob">
                    <span
                      className={`prob-val ${isHigh ? 'prob-high' : 'prob-low'}`}
                    >
                      {record.risk_probability}%
                    </span>
                    <span className="prob-lbl">Risk</span>
                  </div>

                  <div className="hi-outcome">
                    {record.clinical_outcome === null ? (
                      <span className="outcome-pending">Pending</span>
                    ) : record.clinical_outcome === 1 ? (
                      <span className="outcome-confirmed">✅ Confirmed</span>
                    ) : (
                      <span className="outcome-false">❌ False Alarm</span>
                    )}
                  </div>

                  <button
                    className="btn-danger hi-delete"
                    id={`delete-btn-${record.record_id}`}
                    onClick={() => handleDelete(record.record_id)}
                    title="Delete record"
                  >
                    🗑️
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
