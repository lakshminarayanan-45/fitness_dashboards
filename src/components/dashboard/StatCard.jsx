import React from 'react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) => {
  const iconBgClasses = {
    default: 'bg-secondary',
    primary: 'gradient-primary',
    accent: 'gradient-accent',
    success: 'bg-success',
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold font-display">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("mt-2 text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
          iconBgClasses[variant]
        )}>
          <Icon className={cn("h-6 w-6", variant === 'default' ? "text-foreground" : "text-primary-foreground")} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
