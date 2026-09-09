import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">❤️</span>
            <span className="footer-logo-text">
              Cardiac<span className="gradient-text">AI</span>
            </span>
          </div>
          <p className="footer-tagline">
            Explainable cardiac risk intelligence powered by logistic regression
            and a transparent AI pipeline.
          </p>
          <div className="footer-tags">
            <span className="tag">🤖 Machine Learning</span>
            <span className="tag">⚡ FastAPI</span>
            <span className="tag">⚛️ React</span>
            <span className="tag">🔍 Explainable AI</span>
          </div>
        </div>

        {/* Stack */}
        <div className="footer-col">
          <h4 className="footer-col-title">Tech Stack</h4>
          <ul className="footer-list">
            <li>FastAPI — REST API backend</li>
            <li>scikit-learn — ML model</li>
            <li>Pydantic — Data validation</li>
            <li>React + Vite — Frontend</li>
            <li>Recharts — Visualizations</li>
            <li>Framer Motion — Animations</li>
            <li>Docker — Containerisation</li>
          </ul>
        </div>

        {/* Endpoints */}
        <div className="footer-col">
          <h4 className="footer-col-title">API Endpoints</h4>
          <ul className="footer-list mono">
            <li>POST /diagnostics/</li>
            <li>GET /diagnostics/</li>
            <li>GET /diagnostics/:id</li>
            <li>PUT /diagnostics/:id</li>
            <li>DELETE /diagnostics/:id</li>
            <li>GET /health</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider container">
        <div className="divider" style={{ margin: '0' }} />
      </div>

      {/* Creator bar */}
      <div className="footer-creator container">
        <div className="creator-left">
          <div className="creator-avatar">MS</div>
          <div className="creator-info">
            <span className="creator-name">Muhammed Sajad</span>
            <span className="creator-role">ML Engineer · AI Researcher</span>
          </div>
        </div>

        <div className="creator-links">
          <a
            href="https://github.com/mhd-sajad"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
            id="footer-github-link"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58
                0-.28-.01-1.03-.01-2.02-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75
                -1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.5 1
                .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22
                -.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01
                2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23
                1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01
                2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/mhd--sajad/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
            id="footer-linkedin-link"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14
                1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85
                3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14
                2.07 2.07 0 0 1 0 4.14zM3.56 20.45h3.55V9H3.56v11.45zM22.22 0H1.77
                C.79 0 0 .78 0 1.73v20.54C0 23.2.79 24 1.77 24h20.45c.98 0 1.78-.8
                1.78-1.73V1.73C24 .78 23.2 0 22.22 0z"/>
            </svg>
            LinkedIn
          </a>
        </div>

        <div className="footer-copy">
          © 2026 Muhammed Sajad · Built with ❤️ and Python
        </div>
      </div>
    </footer>
  );
}
