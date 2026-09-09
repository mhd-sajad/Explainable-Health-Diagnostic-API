import './Footer.css';

const stack = ['FastAPI', 'scikit-learn', 'React', 'Vite', 'Docker', 'Nginx'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">CARDIAC<span>AI</span></div>
            <p className="footer-brand-desc">
              An explainable cardiac risk diagnostic system powered by logistic regression
              and transparent per-feature contribution scores.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="footer-col-title">Navigate</div>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#calculator">Calculator</a></li>
              <li><a href="#results">Results</a></li>
              <li><a href="#explain">Explainability</a></li>
              <li><a href="#history">History</a></li>
            </ul>
          </div>

          {/* Author */}
          <div>
            <div className="footer-col-title">Created by</div>
            <div className="footer-author">
              <div className="footer-avatar">MS</div>
              <div>
                <div className="footer-author-name">Muhammed Sajad</div>
                <div className="footer-author-role">ML Engineer · AI Researcher</div>
              </div>
            </div>
            <div className="footer-social">
              <a href="https://github.com/mhd-sajad" target="_blank" rel="noopener">
                ⬡ GitHub
              </a>
              <a href="https://www.linkedin.com/in/mhd--sajad/" target="_blank" rel="noopener">
                ◈ LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 Muhammed Sajad · Built with ♥ and Python
          </div>
          <div className="footer-stack">
            {stack.map(s => (
              <span key={s} className="footer-stack-badge">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
