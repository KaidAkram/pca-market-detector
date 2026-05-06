import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HistoricalTimeline = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Factor Trajectory</h3>
          <p className="text-white/40 text-xs font-mono">Temporal Evolution of PC1-3</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-[10px] text-white/40 uppercase">PC1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-white/40 uppercase">PC2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[10px] text-white/40 uppercase">PC3</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis 
              dataKey="Date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff30', fontSize: 10 }}
              minTickGap={50}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff30', fontSize: 10 }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="PC1" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="PC2" 
              stroke="#10b981" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="PC3" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalTimeline;
