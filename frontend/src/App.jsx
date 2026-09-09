import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Calculator from './components/Calculator';
import Results from './components/Results';
import FeatureImportance from './components/FeatureImportance';
import History from './components/History';
import Footer from './components/Footer';
import './index.css';
import './App.css';

export default function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  const handleResult = (data) => {
    setLatestResult(data);
    setHistoryTrigger((t) => t + 1);
  };

  return (
    <>
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <Navbar />

      <main>
        <Hero />

        <div className="divider container" />

        <Calculator onResult={handleResult} />

        {latestResult && (
          <>
            <div className="divider container" />
            <Results result={latestResult} />

            <div className="divider container" />
            <FeatureImportance result={latestResult} />
          </>
        )}

        <div className="divider container" />
        <History refreshTrigger={historyTrigger} />
      </main>

      <Footer />
    </>
  );
}
