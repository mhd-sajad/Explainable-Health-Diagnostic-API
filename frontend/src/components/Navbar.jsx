import { useState, useEffect } from 'react';
import { healthCheck } from '../api';
import './Navbar.css';

const links = [
  { href: '#calculator', label: 'Assess' },
  { href: '#results',    label: 'Results' },
  { href: '#explain',    label: 'Explain' },
  { href: '#history',    label: 'History' },
];

export default function Navbar() {
  const [online, setOnline] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    healthCheck()
      .then(() => setOnline(true))
      .catch(() => setOnline(false));

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="navbar-logo">
        <span className="logo-icon">♥</span>
        CARDIAC<span className="lime">AI</span>
      </a>

      <ul className="navbar-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>

      <div className="navbar-status">
        <div className={`status-badge ${online ? 'online' : ''}`}>
          <span className="status-dot" />
          {online ? 'API Live' : 'Offline'}
        </div>
      </div>
    </nav>
  );
}
