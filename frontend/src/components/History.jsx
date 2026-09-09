import { useState, useEffect } from 'react';
import { getAllAssessments, deleteAssessment } from '../api';
import './History.css';

export default function History() {
  const [records, setRecords] = useState([]);

  const load = () =>
    getAllAssessments().then(r => setRecords(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    await deleteAssessment(id).catch(() => {});
    load();
  };

  return (
    <section className="history-section" id="history">
      <div className="container">
        <div className="history-header">
          <div>
            <h2 className="history-title">
              Assessment <span>History</span>
            </h2>
            <div className="history-count">{records.length} record{records.length !== 1 ? 's' : ''} stored</div>
          </div>
          <button className="btn btn-outline" onClick={load}>↻ Refresh</button>
        </div>

        {records.length === 0 ? (
          <div className="history-empty">No assessments yet — run one above</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Risk</th>
                <th>Probability</th>
                <th>Age</th>
                <th>BP</th>
                <th>Chol</th>
                <th>HR</th>
                <th>Record ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.record_id}>
                  <td>
                    <span className={`risk-pill ${r.risk_assessment === 'High Risk' ? 'high' : 'low'}`}>
                      {r.risk_assessment === 'High Risk' ? '⚠' : '✓'} {r.risk_assessment}
                    </span>
                  </td>
                  <td>{r.risk_probability}%</td>
                  <td>{r.vitals?.age ?? '—'}</td>
                  <td>{r.vitals?.blood_pressure ?? '—'}</td>
                  <td>{r.vitals?.cholesterol ?? '—'}</td>
                  <td>{r.vitals?.max_heart_rate ?? '—'}</td>
                  <td style={{ opacity: 0.4, fontSize: '10px' }}>{r.record_id?.slice(0, 8)}…</td>
                  <td>
                    <button className="history-del" onClick={() => del(r.record_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
