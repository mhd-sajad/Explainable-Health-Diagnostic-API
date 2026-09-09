import { useState } from 'react';
import './App.css';

import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Calculator       from './components/Calculator';
import Results          from './components/Results';
import FeatureImportance from './components/FeatureImportance';
import History          from './components/History';
import Footer           from './components/Footer';

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />
      <Calculator onResult={setResult} />
      <Results result={result} />
      <FeatureImportance result={result} />
      <History />
      <Footer />
    </>
  );
}
