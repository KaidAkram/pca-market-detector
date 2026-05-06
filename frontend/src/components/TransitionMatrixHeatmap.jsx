import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTransitionMatrix } from '../services/api';

const TransitionMatrixHeatmap = () => {
  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await getTransitionMatrix();
        setMatrix(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  if (loading || !matrix) return (
    <div className="h-full flex items-center justify-center text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
      Computing Markovian Pathing...
    </div>
  );

  const regimes = Object.keys(matrix);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h3 className="text-white font-bold text-xl leading-tight mb-1">Regime Transition Matrix</h3>
          <p className="text-white/30 text-[9px] font-mono uppercase tracking-widest">Markovian Predictive Engine</p>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] text-white/40 font-mono">P(St+1 | St)</div>
        </div>
      </div>

      <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${regimes.length + 1}, 1fr)` }}>
        {/* Header Spacer */}
        <div />
        {regimes.map(r => (
          <div key={`header-${r}`} className="text-[8px] font-bold text-blue-400/60 uppercase text-center flex items-center justify-center p-1">
            {r.split(' ')[0]}
          </div>
        ))}

        {regimes.map(row => (
          <React.Fragment key={`row-${row}`}>
            <div className="text-[8px] font-bold text-white/40 uppercase flex items-center justify-end pr-2 py-2">
              {row.split(' ')[0]}
            </div>
            {regimes.map(col => {
              const val = matrix[row][col];
              const opacity = val === 0 ? 0.02 : Math.max(0.1, val);
              return (
                <div 
                  key={`${row}-${col}`}
                  className="relative group flex items-center justify-center rounded-lg border border-white/5 transition-all hover:border-white/20 overflow-hidden"
                  style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                >
                  <span className="text-[10px] font-mono font-bold text-white relative z-10">
                    {(val * 100).toFixed(0)}%
                  </span>
                  {val > 0.5 && (
                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-blue-500/80" />
          <span className="text-[9px] text-white/30 uppercase tracking-widest">High Prob</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-blue-500/20" />
          <span className="text-[9px] text-white/30 uppercase tracking-widest">Stability</span>
        </div>
      </div>
    </div>
  );
};

export default TransitionMatrixHeatmap;
