import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, Layers } from 'lucide-react';

const PortfolioAllocation = ({ regime }) => {
  // Define dynamic allocations based on the regime
  const getAllocation = (regimeName) => {
    switch (regimeName) {
      case 'Trend Market':
        return [
          { name: 'S&P 500 (Risk-On)', value: 100, color: '#3b82f6' }
        ];
      case 'Range Market':
        return [
          { name: 'S&P 500 (Risk-On)', value: 50, color: '#3b82f6' },
          { name: 'Cash/Treasuries (Risk-Off)', value: 50, color: '#64748b' }
        ];
      case 'Crisis':
        return [
          { name: 'Cash/Treasuries (Risk-Off)', value: 100, color: '#ef4444' }
        ];
      case 'Inflation Shock':
      case 'Liquidity Expansion':
        return [
          { name: 'Gold/Commodities (Hedge)', value: 100, color: '#eab308' }
        ];
      default:
        return [
          { name: 'S&P 500 (Risk-On)', value: 50, color: '#3b82f6' },
          { name: 'Cash/Treasuries (Risk-Off)', value: 50, color: '#64748b' }
        ];
    }
  };

  const data = regime ? getAllocation(regime) : [];

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="text-blue-400" size={16} />
            <h3 className="text-white font-bold">Target Allocation</h3>
          </div>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Mathematical Portfolio Weights
          </p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          <Layers className="text-white/40" size={16} />
        </div>
      </div>

      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`${value}%`, 'Target']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white">{data.length > 0 ? data[0].value : 0}%</span>
          <span className="text-[8px] text-white/40 uppercase tracking-widest font-mono mt-1">
            {data.length === 1 ? 'Conviction' : 'Diversified'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-white/70">{item.name}</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioAllocation;
