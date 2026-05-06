import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBacktest } from '../services/api';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MetricCard = ({ label, value, isPositive, suffix = '%' }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono">{label}</span>
    <span className={`text-xl font-bold font-mono tracking-tighter ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
      {value}{suffix}
    </span>
  </div>
);

const StrategyBacktest = () => {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBacktest = async () => {
      try {
        const res = await getBacktest();
        setData(res.equity_curve);
        setMetrics(res.metrics);
      } catch (err) {
        console.error('Backtest fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBacktest();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest animate-pulse">
          Loading Backtest Engine...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
          No backtest data. Run: python main.py
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-blue-500" size={16} />
            <h3 className="text-white font-bold text-lg">Academic Model vs Benchmark</h3>
          </div>
          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
            PCA Dynamic Beta Allocation // Static Buy & Hold
          </p>
        </div>

        {/* Stats Panel */}
        {metrics && (
          <div className="flex gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <span className="text-[8px] text-blue-400/80 uppercase tracking-widest font-mono block mb-1">PCA Dynamic Beta Model</span>
              <div className="flex gap-4">
                <MetricCard label="Return" value={metrics.strategy_total_return} isPositive={metrics.strategy_total_return > 0} />
                <MetricCard label="Max DD" value={metrics.strategy_max_drawdown} isPositive={false} />
                <MetricCard label="Sharpe" value={metrics.strategy_sharpe} isPositive={metrics.strategy_sharpe > 1} suffix="" />
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono block mb-1">Static Buy & Hold</span>
              <div className="flex gap-4">
                <MetricCard label="Return" value={metrics.benchmark_total_return} isPositive={metrics.benchmark_total_return > 0} />
                <MetricCard label="Max DD" value={metrics.benchmark_max_drawdown} isPositive={false} />
                <MetricCard label="Sharpe" value={metrics.benchmark_sharpe} isPositive={metrics.benchmark_sharpe > 1} suffix="" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Equity Curve Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="strategyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchmarkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="Date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff20', fontSize: 9 }}
              minTickGap={80}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff20', fontSize: 9 }}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${(v).toFixed(2)}x`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                fontSize: '10px' 
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`${(value).toFixed(4)}x`, '']}
              labelStyle={{ color: 'rgba(255,255,255,0.4)' }}
            />
            <Area 
              type="monotone" 
              dataKey="Strategy_Equity" 
              stroke="#3b82f6" 
              strokeWidth={2.5}
              fill="url(#strategyGrad)" 
              name="PCA Dynamic Beta Model"
            />
            <Area 
              type="monotone" 
              dataKey="Benchmark_Equity" 
              stroke="#64748b" 
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#benchmarkGrad)" 
              name="Static Buy & Hold"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-blue-500 rounded" />
          <span className="text-[9px] text-white/40 uppercase font-mono tracking-wider">PCA Dynamic Beta Model</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-slate-500 rounded border-dashed" style={{ borderTop: '2px dashed #64748b', height: 0 }} />
          <span className="text-[9px] text-white/40 uppercase font-mono tracking-wider">Static Buy & Hold</span>
        </div>
      </div>
    </div>
  );
};

export default StrategyBacktest;
