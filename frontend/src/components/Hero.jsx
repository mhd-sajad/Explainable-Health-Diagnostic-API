import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        {/* Left column */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="section-label">
            <span>🧠</span> AI-Powered · Explainable
          </div>

          <h1 className="hero-title">
            Cardiac Risk<br />
            <span className="gradient-text">Intelligence</span>
          </h1>

          <p className="hero-desc">
            Submit patient vitals and receive an instant, explainable cardiac risk
            assessment — powered by a Logistic Regression model with transparent
            per-feature contribution scores.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-val gradient-text">4</span>
              <span className="stat-lbl">Vital Features</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val gradient-text-g">100%</span>
              <span className="stat-lbl">ROC-AUC Score</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val gradient-text-r">Live</span>
              <span className="stat-lbl">API Status</span>
            </div>
          </div>

          <div className="hero-cta">
            <a href="#calculator" className="btn-primary" id="hero-cta-btn">
              <span>Run Assessment</span>
              <span>→</span>
            </a>
            <a href="#history" className="hero-link">View History ↓</a>
          </div>
        </motion.div>

        {/* Right column — animated heart orb */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="heart-orb">
            <div className="heart-ring ring-1" />
            <div className="heart-ring ring-2" />
            <div className="heart-ring ring-3" />
            <div className="heart-core">
              <HeartECG />
            </div>
          </div>

          <div className="floating-card fc-1">
            <span className="fc-icon">🫀</span>
            <div>
              <div className="fc-val">High Risk</div>
              <div className="fc-lbl">87.4% probability</div>
            </div>
          </div>

          <div className="floating-card fc-2">
            <span className="fc-icon">🧬</span>
            <div>
              <div className="fc-val">Age: +1.23</div>
              <div className="fc-lbl">Feature contribution</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeartECG() {
  return (
    <svg viewBox="0 0 200 80" className="ecg-svg" xmlns="http://www.w3.org/2000/svg">
      <polyline
        className="ecg-line"
        points="0,40 30,40 40,40 45,10 50,70 55,40 70,40 75,5 80,75 85,40 100,40 110,40 120,40 130,40 135,15 140,65 145,40 160,40 200,40"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
