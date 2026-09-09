import './Hero.css';

const tickerItems = [
  'Cardiac Risk Assessment', 'Logistic Regression', 'Explainable AI',
  'Feature Importance', 'Real-time Inference', 'FastAPI Backend',
  'Cardiac Risk Assessment', 'Logistic Regression', 'Explainable AI',
  'Feature Importance', 'Real-time Inference', 'FastAPI Backend',
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hex">♥</span>
            AI-Powered · Explainable · Real-time
          </div>

          <h1 className="hero-title">
            Cardiac
            <span className="line-lime">Risk</span>
            Intelligence
          </h1>

          <p className="hero-subtitle">
            Submit patient vitals and receive an instant, transparent cardiac risk
            assessment — powered by a Logistic Regression model with per-feature
            contribution scores.
          </p>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">4</div>
              <div className="hero-stat-label">Vital Features</div>
            </div>
            <div>
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">ROC-AUC Score</div>
            </div>
            <div>
              <div className="hero-stat-num">XAI</div>
              <div className="hero-stat-label">Explainable</div>
            </div>
          </div>

          <div className="hero-cta">
            <a href="#calculator" className="btn btn-lime">
              Run Assessment →
            </a>
            <a href="#history" className="hero-cta-link">
              View History ↓
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="hero-orb">
            <span className="hero-orb-icon">🫀</span>
          </div>

          <div className="hero-card hero-card-1">
            <div className="hero-card-label">Latest Result</div>
            <div className="hero-card-value risk-high">HIGH RISK</div>
          </div>

          <div className="hero-card hero-card-2">
            <div className="hero-card-label">Probability</div>
            <div className="hero-card-value lime">93.12%</div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="hero-ticker">
        <div className="hero-ticker-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="hero-ticker-item">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
