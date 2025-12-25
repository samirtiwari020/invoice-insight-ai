import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

interface Chart3DProps {
  data: any[];
  type: 'area' | 'bar' | 'pie' | 'line';
  dataKey: string;
  nameKey?: string;
  height?: number;
  colors?: string[];
  showGrid?: boolean;
  vertical?: boolean;
}

const defaultColors = [
  'hsl(var(--primary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
  'hsl(var(--destructive))',
  'hsl(var(--accent))',
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-xl"
      >
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </motion.div>
    );
  }
  return null;
};

export const Chart3DArea: React.FC<{
  data: any[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
  gradientId?: string;
}> = ({ data, dataKey, xAxisKey, height = 200, color = 'hsl(var(--primary))', gradientId = 'areaGradient' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
      style={{ height }}
    >
      {/* 3D depth shadow effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-20 blur-xl"
        style={{ 
          background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
          transform: 'translateY(10px) scale(0.95)',
        }}
      />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="50%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(v) => typeof v === 'number' ? `$${v}` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            filter="url(#glow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const Chart3DBar: React.FC<{
  data: any[];
  dataKey: string;
  xAxisKey: string;
  height?: number;
  colors?: string[];
  vertical?: boolean;
}> = ({ data, dataKey, xAxisKey, height = 200, colors = defaultColors, vertical = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout={vertical ? 'vertical' : 'horizontal'}
        >
          <defs>
            {colors.map((color, i) => (
              <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>
          {vertical ? (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis dataKey={xAxisKey} type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey={dataKey} 
            radius={vertical ? [0, 8, 8, 0] : [8, 8, 0, 0]}
            filter="url(#barShadow)"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={`url(#barGrad${index % colors.length})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const Chart3DPie: React.FC<{
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  colors?: string[];
  innerRadius?: number;
  showLabels?: boolean;
}> = ({ 
  data, 
  dataKey, 
  nameKey, 
  height = 200, 
  colors = defaultColors,
  innerRadius = 50,
  showLabels = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ height, perspective: '1000px' }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {colors.map((color, i) => (
              <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
              </linearGradient>
            ))}
            <filter id="pieShadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.25" />
            </filter>
          </defs>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={80}
            paddingAngle={2}
            label={showLabels ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
            labelLine={showLabels}
            filter="url(#pieShadow)"
          >
            {data.map((_, index) => (
              <Cell 
                key={index} 
                fill={`url(#pieGrad${index % colors.length})`}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const Chart3DLine: React.FC<{
  data: any[];
  lines: { dataKey: string; color: string; name: string }[];
  xAxisKey: string;
  height?: number;
}> = ({ data, lines, xAxisKey, height = 200 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <filter id="lineShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {lines.map((line, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              filter="url(#lineShadow)"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
