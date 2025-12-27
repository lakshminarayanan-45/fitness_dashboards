import React from 'react';
import { cn } from '@/lib/utils';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const iconBgClasses = {
    default: 'bg-secondary',
    primary: 'gradient-primary glow-primary',
    accent: 'gradient-accent',
    success: 'bg-success',
  };

  return (
    <div className="stat-card group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-display">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "mt-2 text-sm font-medium flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span className={cn(
                "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs",
                trend.isPositive ? "bg-success/20" : "bg-destructive/20"
              )}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconBgClasses[variant]
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'default' ? "text-foreground" : "text-primary-foreground"
          )} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
