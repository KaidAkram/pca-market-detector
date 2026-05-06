import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const REGIME_COLORS = {
  'Crisis': '#ef4444',            // Red
  'Trend Market': '#f97316',      // Orange
  'Range Market': '#22c55e',      // Green
  'Liquidity Expansion': '#3b82f6', // Blue
  'Inflation Shock': '#a855f7'     // Purple
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{data.Date}</p>
        <p className="text-lg font-bold mb-3" style={{ color: REGIME_COLORS[data.Regime] }}>
          {data.Regime}
        </p>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between gap-8">
            <span className="text-white/40">PC1:</span>
            <span className="text-white">{data.PC1.toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-white/40">PC2:</span>
            <span className="text-white">{data.PC2.toFixed(4)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MacroScatterPlot = ({ data }) => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col p-4">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">Cluster Analysis</h3>
        <p className="text-white/40 text-xs font-mono">Factor Correlation Mapping</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="PC1" 
            name="PC1" 
            stroke="#ffffff40" 
            tick={{ fontSize: 10, fill: '#ffffff40' }}
            axisLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="PC2" 
            name="PC2" 
            stroke="#ffffff40" 
            tick={{ fontSize: 10, fill: '#ffffff40' }}
            axisLine={false}
          />
          <ZAxis type="number" range={[40, 40]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Observations" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={REGIME_COLORS[entry.Regime] || '#64748b'} 
                fillOpacity={0.6}
                stroke={REGIME_COLORS[entry.Regime]}
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroScatterPlot;
