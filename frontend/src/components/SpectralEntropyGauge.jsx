import React from 'react';
import { motion } from 'framer-motion';

const SpectralEntropyGauge = ({ value }) => {
  const percentage = (value || 0) * 100;
  
  // Complexity interpretation
  const getComplexity = (v) => {
    if (v < 0.3) return { label: 'CRITICAL CONCENTRATION', color: 'text-red-500' };
    if (v < 0.6) return { label: 'STRUCTURAL INSTABILITY', color: 'text-amber-500' };
    return { label: 'HEALTHY COMPLEXITY', color: 'text-emerald-500' };
  };

  const status = getComplexity(value);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-white font-bold text-lg leading-tight mb-1">Spectral Entropy</h3>
        <p className="text-white/30 text-[9px] font-mono uppercase tracking-widest">Market Information Density</p>
      </div>

      <div className="my-6 relative h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
        />
      </div>

      <div>
        <p className={`text-[10px] font-bold tracking-tighter mb-1 ${status.color}`}>
          {status.label}
        </p>
        <p className="text-white/40 text-[9px] leading-relaxed">
          High entropy indicates a robust, decoupled market. Lower values signal factor convergence and tail risk.
        </p>
      </div>
    </div>
  );
};

export default SpectralEntropyGauge;
