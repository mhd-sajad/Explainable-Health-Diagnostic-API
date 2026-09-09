import { useEffect, useRef } from 'react';
import './Navbar.css';

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 40);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-inner container">
        <div className="navbar-brand">
          <span className="brand-icon">❤️</span>
          <span className="brand-text">
            Cardiac<span className="gradient-text">AI</span>
          </span>
        </div>
        <div className="navbar-links">
          <a href="#calculator">Calculator</a>
          <a href="#results">Results</a>
          <a href="#importance">Explainability</a>
          <a href="#history">History</a>
        </div>
        <div className="navbar-status" id="nav-status">
          <span className="status-dot"></span>
          <span className="status-text">API Live</span>
        </div>
      </div>
    </nav>
  );
}
