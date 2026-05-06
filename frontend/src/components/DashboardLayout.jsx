import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentRegime, getHistoricalRegimes, getPcaStats } from '../services/api';
import RegimeAlertCard from './RegimeAlertCard';
import MacroScatterPlot from './MacroScatterPlot';
import HistoricalTimeline from './HistoricalTimeline';
import PCASpace3D from './PCASpace3D';
import SpectralEntropyGauge from './SpectralEntropyGauge';
import TransitionMatrixHeatmap from './TransitionMatrixHeatmap';
import AssetLoadingsHeatmap from './AssetLoadingsHeatmap';
import SpectralLog from './SpectralLog';
import ProfessorCommentary from './ProfessorCommentary';
import StrategyBacktest from './StrategyBacktest';
import LiveTicker from './LiveTicker';
import PortfolioAllocation from './PortfolioAllocation';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { RefreshCcw, Database, Info, Activity, Globe, ShieldCheck, TrendingUp, Zap, Gauge, Layers, Terminal, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BentoCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col ${className}`}
  >
    {children}
  </motion.div>
);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [currentRegime, setCurrentRegime] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [current, historical, pcaStats] = await Promise.all([
        getCurrentRegime(),
        getHistoricalRegimes(),
        getPcaStats()
      ]);
      console.log("Historical Data Count:", historical?.length);
      setCurrentRegime(current);
      setHistoricalData(historical || []);
      setStats(pcaStats);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('System Synchronization Failure: Backend Offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center text-blue-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCcw size={64} />
        </motion.div>
        <p className="mt-8 text-sm font-mono tracking-[0.5em] uppercase animate-pulse text-white/50">
          Syncing Spectral Engines
        </p>
      </div>
    );
  }

  const sparklineData = historicalData.slice(-20);

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <LiveTicker currentRegime={currentRegime} />
      
      <div className="p-4 md:p-8">
        {/* Premium Header */}
        <header className="max-w-[1600px] mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe className="text-blue-400" size={20} />
            </div>
            <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Global Macro Core v2.5</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-none mb-2 italic">
            PCA MARKET <span className="text-blue-500">DETECTOR</span>
          </h1>
          <div className="flex items-center gap-6 text-white/40 text-[11px] font-mono uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck className="text-blue-500" size={14} /> Spectral Rigor</span>
            <span className="flex items-center gap-2"><Zap className="text-amber-500" size={14} /> Real-Time Inference</span>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-blue-400" size={12} />
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Eigen-Stability (κ)</p>
            </div>
            <div className="flex items-end gap-6">
              <p className="text-3xl font-mono font-bold text-white tracking-tighter leading-none">
                {currentRegime?.ConditionNumber?.toFixed(2) || 'N/A'}
              </p>
              <div className="w-16 h-8 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="ConditionNumber" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="text-emerald-400" size={12} />
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Market Entropy (H)</p>
            </div>
            <div className="flex items-end gap-6">
              <p className="text-3xl font-mono font-bold text-white tracking-tighter leading-none">
                {currentRegime?.SpectralEntropy?.toFixed(3) || 'N/A'}
              </p>
              <div className="w-16 h-8 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="SpectralEntropy" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
        
        {/* Current State - Large Bento */}
        <BentoCard className="md:col-span-5 md:row-span-2" delay={0.1}>
          {currentRegime && (
            <RegimeAlertCard 
              regime={currentRegime.Regime} 
              date={currentRegime.Date} 
              isBento={true}
              onViewProofs={() => navigate('/proofs')}
            />
          )}
        </BentoCard>

        {/* Target Allocation - New Bento */}
        <BentoCard className="md:col-span-3 md:row-span-2" delay={0.15}>
          <PortfolioAllocation regime={currentRegime?.Regime} />
        </BentoCard>

        {/* 3D Visualization - Square Bento */}
        <BentoCard className="md:col-span-4 md:row-span-2" delay={0.2}>
          <PCASpace3D data={historicalData} key={`pca-${historicalData.length}`} />
        </BentoCard>

        {/* Spectral Entropy - Small Bento */}
        <BentoCard className="md:col-span-3 md:row-span-1 p-6" delay={0.3}>
          <SpectralEntropyGauge value={currentRegime?.SpectralEntropy} />
        </BentoCard>

        {/* Markov Transition Heatmap - Medium Bento */}
        <BentoCard className="md:col-span-4 md:row-span-2 p-8" delay={0.4}>
          <TransitionMatrixHeatmap />
        </BentoCard>

        {/* Asset Loadings - Large Bento */}
        <BentoCard className="md:col-span-5 md:row-span-2 p-8" delay={0.45}>
          <AssetLoadingsHeatmap />
        </BentoCard>

        {/* Cluster Analysis - Small Bento */}
        <BentoCard className="md:col-span-3 md:row-span-2 p-6" delay={0.5}>
          <MacroScatterPlot data={historicalData} key={`scatter-${historicalData.length}`} />
        </BentoCard>

        {/* Live Engine Log - Medium Bento */}
        <BentoCard className="md:col-span-4 md:row-span-2" delay={0.55}>
          <SpectralLog />
        </BentoCard>

        {/* Professor's Corner - Medium Bento */}
        <BentoCard className="md:col-span-4 md:row-span-2" delay={0.6}>
          <ProfessorCommentary />
        </BentoCard>

        {/* Strategy Backtest - Full Width Bento */}
        <BentoCard className="md:col-span-12 md:row-span-2" delay={0.65}>
          <StrategyBacktest />
        </BentoCard>

        {/* Factor Timeline - Wide Bento */}
        <BentoCard className="md:col-span-8 md:row-span-2 p-8" delay={0.7}>
          <HistoricalTimeline data={historicalData} key={`timeline-${historicalData.length}`} />
        </BentoCard>

      </main>
      
        <footer className="mt-24 py-12 border-t border-white/5 flex justify-between items-center text-white/10 text-[10px] font-mono tracking-[0.5em] uppercase">
          <p>Projected via Principal Component Eigendecomposition Pipeline</p>
          <div className="flex gap-8">
            <span>Spectral Rigor</span>
            <span>Matrix Stability</span>
            <span>Markovian Pathing</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
