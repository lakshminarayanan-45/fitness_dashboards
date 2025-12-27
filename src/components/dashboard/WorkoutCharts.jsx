import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useWorkout } from '@/contexts/WorkoutContext';

const WorkoutCharts = () => {
  const { getChartData } = useWorkout();
  const { lineData, barData } = getChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-3 border border-border shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Line Chart - Trends */}
      <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
        <h3 className="mb-6 font-display text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full gradient-primary"></span>
          Weekly Trends
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(16, 100%, 60%)" />
                  <stop offset="100%" stopColor="hsl(35, 100%, 55%)" />
                </linearGradient>
                <linearGradient id="accentGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(174, 72%, 46%)" />
                  <stop offset="100%" stopColor="hsl(190, 80%, 50%)" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="duration"
                name="Duration (min)"
                stroke="url(#primaryGradient)"
                strokeWidth={3}
                dot={{ fill: 'hsl(16, 100%, 60%)', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 8, fill: 'hsl(16, 100%, 60%)', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                name="Volume (kg)"
                stroke="url(#accentGradient)"
                strokeWidth={3}
                dot={{ fill: 'hsl(174, 72%, 46%)', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 8, fill: 'hsl(174, 72%, 46%)', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Weekly Progress */}
      <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
        <h3 className="mb-6 font-display text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full gradient-accent"></span>
          Weekly Progress
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={8}>
              <defs>
                <linearGradient id="barPrimaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(16, 100%, 60%)" />
                  <stop offset="100%" stopColor="hsl(16, 100%, 50%)" />
                </linearGradient>
                <linearGradient id="barAccentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(174, 72%, 46%)" />
                  <stop offset="100%" stopColor="hsl(174, 72%, 36%)" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar
                dataKey="workouts"
                name="Workouts"
                fill="url(#barPrimaryGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="duration"
                name="Duration (min)"
                fill="url(#barAccentGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCharts;
