import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Droplets, Zap, Activity, ArrowRight } from 'lucide-react';

const REGIME_CONFIG = {
  'Crisis': {
    color: 'from-red-600 to-red-900',
    accent: 'text-red-400',
    icon: AlertTriangle,
    description: 'Systemic Risk Liquidation'
  },
  'Trend Market': {
    color: 'from-emerald-600 to-emerald-900',
    accent: 'text-emerald-400',
    icon: TrendingUp,
    description: 'Structural Growth Expansion'
  },
  'Liquidity Expansion': {
    color: 'from-cyan-600 to-cyan-900',
    accent: 'text-cyan-400',
    icon: Droplets,
    description: 'Monetary Easing / USD Weakness'
  },
  'Inflation Shock': {
    color: 'from-amber-600 to-amber-900',
    accent: 'text-amber-400',
    icon: Zap,
    description: 'Cost-Push Pressure'
  },
  'Range Market': {
    color: 'from-slate-700 to-slate-900',
    accent: 'text-slate-400',
    icon: Activity,
    description: 'Mean-Reverting Consolidation'
  }
};

const RegimeAlertCard = ({ regime, date, onViewProofs }) => {
  const config = REGIME_CONFIG[regime] || REGIME_CONFIG['Range Market'];
  const Icon = config.icon;

  return (
    <div className={`relative h-full w-full flex-1 overflow-hidden flex flex-col justify-between p-8 md:p-12 bg-gradient-to-br ${config.color}`}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
            Live Analysis
          </div>
          <span className="text-white/60 text-xs font-mono">{date}</span>
        </motion.div>
        
        <motion.h2 
          key={regime}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white uppercase italic"
        >
          {regime}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-white/80 max-w-xl"
        >
          {config.description}. The 60-day PCA axes have rotated into a state of high variance concentration.
        </motion.p>
      </div>

      <div className="relative z-10 mt-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
            <Icon className="text-white" size={40} />
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Risk Status</p>
            <p className="text-lg font-bold text-white">ACTIVE MONITORING</p>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ x: 10 }}
          onClick={onViewProofs}
          className="flex items-center gap-2 text-white/80 text-sm font-semibold group"
        >
          View Math Proofs <ArrowRight size={16} className="group-hover:text-white transition-colors" />
        </motion.button>
      </div>
    </div>
  );
};

export default RegimeAlertCard;
