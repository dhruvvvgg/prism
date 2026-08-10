import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface DonutSegment {
  id: string;
  name: string;
  percentage: number;
  value: number;
  color: string;
  hoverColor: string;
}

const segmentsData: DonutSegment[] = [
  { id: 'gsec', name: 'Govt Sec', percentage: 40, value: 2400000, color: '#10B981', hoverColor: '#059669' },
  { id: 'debt-etf', name: 'Debt ETFs', percentage: 20, value: 1200000, color: '#14B8A6', hoverColor: '#0D9488' },
  { id: 'equities', name: 'Equities', percentage: 15, value: 900000, color: '#6366F1', hoverColor: '#4F46E5' },
  { id: 'sgb', name: 'SGB Gold', percentage: 15, value: 900000, color: '#F59E0B', hoverColor: '#D97706' },
  { id: 'corp-bond', name: 'Corp Bonds', percentage: 10, value: 600000, color: '#3B82F6', hoverColor: '#2563EB' }
];

export default function InteractiveDonutChart() {
  const shouldReduceMotion = useReducedMotion();
  const [activeSegment, setActiveSegment] = useState<DonutSegment | null>(null);

  // SVG parameters
  const size = 200;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-2">
      {/* SVG Donut Ring */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Outer Ambient Glow */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E6E5E0"
            className="dark:stroke-[#2E2D2A]"
            strokeWidth={strokeWidth}
          />

          {/* Animated Donut Segments */}
          {segmentsData.map((seg) => {
            const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += seg.percentage;
            const isHovered = activeSegment?.id === seg.id;

            return (
              <motion.circle
                key={seg.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={shouldReduceMotion ? false : { strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${seg.color})` : 'none',
                  opacity: activeSegment && !isHovered ? 0.4 : 1,
                }}
                onMouseEnter={() => setActiveSegment(seg)}
                onMouseLeave={() => setActiveSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center Dynamic Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
          <motion.span 
            key={activeSegment ? activeSegment.id : 'total'}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0] leading-tight"
          >
            {activeSegment ? `${activeSegment.percentage}%` : '100%'}
          </motion.span>
          <span className="text-[10px] font-mono font-extrabold uppercase text-[#71706C] dark:text-[#A19F9A] tracking-wider mt-0.5">
            {activeSegment ? activeSegment.name : 'Aggregated Mix'}
          </span>
          {activeSegment && (
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              ₹{activeSegment.value.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {segmentsData.map((seg) => {
          const isSelected = activeSegment?.id === seg.id;
          return (
            <div
              key={seg.id}
              onMouseEnter={() => setActiveSegment(seg)}
              onMouseLeave={() => setActiveSegment(null)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-sm scale-[1.02]' 
                  : 'border-[#E6E5E0] dark:border-[#2E2D2A] bg-white dark:bg-[#1C1B19] hover:bg-[#FAF9F6] dark:hover:bg-[#252422]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: seg.color }} />
                <span className="text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                  {seg.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">
                  {seg.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
