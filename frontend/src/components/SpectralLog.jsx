import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const SpectralLog = () => {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef();

  const generateLog = () => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const ops = [
      'SPECTRAL_BASIS_DECOMPOSITION_COMPLETE',
      'SIGMA_MATRIX_STABILIZATION_PROTOCOL',
      'KAPPA_CONDITION_NUMBER_OPTIMIZED',
      'ORBITAL_FACTOR_ROTATION_SYNCED',
      'SHANNON_ENTROPY_DIVERGENCE_CHECK',
      'ADF_STATIONARITY_P_VALUE_VALIDATED',
      'MARKOV_TRANSITION_PROBABILITY_CONVERGED',
      'LATENT_BASIS_MANIFOLD_FLUSHED',
      'ORTHOGONAL_EIGEN_SUBSPACE_LOCKED',
      'RMT_NOISE_THRESHOLD_CROSSED'
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const val = (Math.random() * 100).toFixed(4);
    return `[${timestamp}] ${op} :: val=${val}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-15), generateLog()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col font-mono text-[10px] text-blue-400/80 p-4">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2 text-white/40">
        <Terminal size={12} />
        <span className="uppercase tracking-[0.3em]">Live Spectral Engine Stream</span>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-1 scrollbar-hide select-none"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-white/20 shrink-0">#0{i}</span>
            <span className={i === logs.length - 1 ? 'text-blue-300 animate-pulse' : ''}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpectralLog;
