import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLoadings } from '../services/api';

const AssetLoadingsHeatmap = () => {
  const [loadings, setLoadings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoadings = async () => {
      try {
        const data = await getLoadings();
        setLoadings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoadings();
  }, []);

  if (loading || !loadings) return (
    <div className="h-full flex items-center justify-center text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
      Extracting Spectral Loadings...
    </div>
  );

  const pcs = ['PC1', 'PC2', 'PC3'];
  const assets = Object.keys(loadings['PC1']);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-white font-bold text-xl leading-tight mb-1">Asset Spectral Loadings</h3>
          <p className="text-white/30 text-[9px] font-mono uppercase tracking-widest">Eigenvector Component Audit</p>
        </div>
      </div>

      <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${pcs.length + 1}, 1fr)` }}>
        {/* Header */}
        <div />
        {pcs.map(pc => (
          <div key={pc} className="text-[10px] font-bold text-blue-400 uppercase text-center p-2">
            {pc}
          </div>
        ))}

        {/* Rows */}
        {assets.map(asset => (
          <React.Fragment key={asset}>
            <div className="text-[10px] font-bold text-white/50 uppercase flex items-center pr-4 py-1">
              {asset}
            </div>
            {pcs.map(pc => {
              const val = loadings[pc][asset];
              const isPositive = val >= 0;
              const opacity = Math.min(0.9, Math.abs(val) * 2);
              const color = isPositive ? 'rgba(16, 185, 129' : 'rgba(239, 68, 68'; // emerald vs red
              
              return (
                <div 
                  key={`${asset}-${pc}`}
                  className="rounded-md border border-white/5 flex items-center justify-center transition-all hover:scale-105"
                  style={{ backgroundColor: `${color}, ${opacity})` }}
                >
                  <span className="text-[9px] font-mono font-bold text-white">
                    {val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Long Loading</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Short Loading</span>
        </div>
      </div>
    </div>
  );
};

export default AssetLoadingsHeatmap;
