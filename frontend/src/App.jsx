import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MathProofs from './components/MathProofs';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardLayout />} />
          <Route path="/proofs" element={<MathProofs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
