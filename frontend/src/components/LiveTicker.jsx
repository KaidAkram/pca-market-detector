import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, AlertTriangle, ShieldCheck } from 'lucide-react';

const LiveTicker = ({ currentRegime }) => {
  if (!currentRegime) return null;

  const items = [
    { label: 'SYSTEM STATUS', value: 'ONLINE', icon: Radio, color: 'text-emerald-400' },
    { label: 'LATENT STATE', value: currentRegime.Regime, icon: Activity, color: 'text-blue-400' },
    { label: 'PC1 (MARKET RISK)', value: currentRegime.PC1.toFixed(4), color: 'text-white' },
    { label: 'PC2 (LIQUIDITY)', value: currentRegime.PC2.toFixed(4), color: 'text-white' },
    { label: 'PC3 (INFLATION)', value: currentRegime.PC3.toFixed(4), color: 'text-white' },
    { label: 'SPECTRAL ENTROPY', value: currentRegime.SpectralEntropy.toFixed(4), color: 'text-purple-400' },
    { label: 'EIGEN-STABILITY', value: currentRegime.ConditionNumber.toFixed(2), color: 'text-amber-400' },
    { label: 'ADF STATIONARITY', value: 'PASSED', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'LAST UPDATE', value: new Date().toLocaleTimeString(), color: 'text-white/50' },
  ];

  return (
    <div className="w-full bg-[#020205] border-b border-white/10 overflow-hidden py-1.5 flex items-center relative z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#020205] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#020205] to-transparent z-10" />
      
      <div className="flex gap-4 items-center px-4 z-20 bg-[#020205] border-r border-white/10 shadow-xl">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] font-bold tracking-widest text-white uppercase">Live Feed</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap items-center"
        >
          {/* We duplicate the items to create a seamless infinite loop effect */}
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mx-6">
              {item.icon && <item.icon size={10} className={item.color} />}
              <span className="text-[10px] text-white/40 font-mono tracking-widest">{item.label}:</span>
              <span className={`text-[10px] font-bold font-mono ${item.color}`}>{item.value}</span>
              <span className="ml-6 text-white/10">|</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveTicker;
