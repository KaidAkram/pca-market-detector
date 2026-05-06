import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Play, Pause, Filter } from 'lucide-react';
import * as THREE from 'three';
import { getPcaStats } from '../services/api';

const REGIME_COLORS = {
  'Crisis': '#ef4444',
  'Trend Market': '#f97316',
  'Range Market': '#22c55e',
  'Liquidity Expansion': '#3b82f6',
  'Inflation Shock': '#a855f7'
};

const ScatterPoints = ({ data }) => {
  const meshRef = useRef();
  const SCALE = 8;

  const { positions, colors } = useMemo(() => {
    if (!data || data.length === 0) return { positions: new Float32Array(0), colors: new Float32Array(0) };

    const pos = new Float32Array(data.length * 3);
    const cols = new Float32Array(data.length * 3);

    data.forEach((d, i) => {
      pos[i * 3] = (d.PC1 || 0) * SCALE;
      pos[i * 3 + 1] = (d.PC2 || 0) * SCALE;
      pos[i * 3 + 2] = (d.PC3 || 0) * SCALE;

      const color = new THREE.Color(REGIME_COLORS[d.Regime] || '#94a3b8');
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    });

    return { positions: pos, colors: cols };
  }, [data]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.6} 
        vertexColors 
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const PCASpace3D = ({ data }) => {
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [autoRotate, setAutoRotate] = useState(true);
  
  const regimes = Object.keys(REGIME_COLORS);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (activeFilter === 'All') return data;
    return data.filter(d => d.Regime === activeFilter);
  }, [data, activeFilter]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPcaStats();
        setStats(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const getLabel = (pc) => {
    if (!stats || !stats[pc]) return pc;
    const ratio = (stats[pc].variance_ratio * 100).toFixed(2);
    return `${pc} - ${ratio}% var`;
  };

  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      {/* Legend & Controls Header */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-start px-4 pointer-events-none">
        
        {/* Filter Controls (Pointer events enabled) */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-lg border transition-colors backdrop-blur-md ${activeFilter === 'All' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/20'}`}
          >
            All Nodes
          </button>
          {regimes.map(regime => (
            <button 
              key={regime}
              onClick={() => setActiveFilter(regime)}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-lg border transition-colors backdrop-blur-md ${activeFilter === regime ? 'text-white' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/20'}`}
              style={{ 
                backgroundColor: activeFilter === regime ? `${REGIME_COLORS[regime]}40` : '',
                borderColor: activeFilter === regime ? REGIME_COLORS[regime] : '' 
              }}
            >
              {regime.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 items-end">
          {regimes.map(regime => (
            <div key={`legend-${regime}`} className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-white/70 uppercase tracking-tight text-right">
                {regime}
              </span>
              <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: REGIME_COLORS[regime], color: REGIME_COLORS[regime] }} />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation Control */}
      <div className="absolute bottom-4 left-4 z-20">
        <button 
          onClick={() => setAutoRotate(!autoRotate)} 
          className="p-3 bg-white/5 hover:bg-white/20 rounded-xl border border-white/10 transition-colors backdrop-blur-md flex items-center gap-2"
        >
          {autoRotate ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
            {autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          </span>
        </button>
      </div>

      <Canvas camera={{ position: [20, 20, 20], fov: 40 }} style={{ background: 'transparent' }}>
        <color attach="background" args={['#020205']} />
        <OrbitControls enableDamping dampingFactor={0.1} autoRotate={autoRotate} autoRotateSpeed={1.0} />
        
        <ambientLight intensity={1.5} />
        <pointLight position={[20, 20, 20]} intensity={1} />
        
        <ScatterPoints data={filteredData} />
        
        <gridHelper args={[40, 10, '#334155', '#1e293b']} position={[0, -10, 0]} />
        <gridHelper args={[40, 10, '#334155', '#1e293b']} position={[-20, 10, 0]} rotation={[0, 0, Math.PI/2]} />
        <gridHelper args={[40, 10, '#334155', '#1e293b']} position={[0, 10, -20]} rotation={[Math.PI/2, 0, 0]} />

        <Text position={[24, -10, 0]} color="#ffffff" fontSize={0.8}>{getLabel('PC1')}</Text>
        <Text position={[-20, 24, 0]} color="#ffffff" fontSize={0.8} rotation={[0, 0, Math.PI/2]}>{getLabel('PC2')}</Text>
        <Text position={[0, -10, 24]} color="#ffffff" fontSize={0.8} rotation={[Math.PI/2, 0, 0]}>{getLabel('PC3')}</Text>
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-[8px] font-mono text-white/20 uppercase tracking-widest flex flex-col items-end">
        <span>Total Records: {data?.length || 0}</span>
        <span className="text-blue-400">Filtered View: {filteredData?.length || 0}</span>
      </div>
    </div>
  );
};

export default PCASpace3D;
