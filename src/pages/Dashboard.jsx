import React from 'react';
import { Flame, Clock, Weight, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import WorkoutCharts from '@/components/dashboard/WorkoutCharts';
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { getWeeklyWorkouts, getTotalTime, getTotalVolume } = useWorkout();

  const weeklyWorkouts = getWeeklyWorkouts();
  const totalTime = getTotalTime();
  const { sets, reps } = getTotalVolume();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="font-display text-3xl font-bold text-gradient">
          {getGreeting()}, {user?.name?.split(' ')[0]} 💪
        </h1>
        <p className="text-muted-foreground">
          Track your progress and crush your fitness goals!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <StatCard
            title="Weekly Workouts"
            value={weeklyWorkouts}
            subtitle="sessions this week"
            icon={Flame}
            variant="primary"
            trend={{ value: 15, isPositive: true }}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="Total Time"
            value={`${totalTime}m`}
            subtitle="minutes exercised"
            icon={Clock}
            variant="accent"
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <StatCard
            title="Total Sets"
            value={sets}
            subtitle={`${reps} total reps`}
            icon={Weight}
            variant="success"
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <StatCard
            title="Streak"
            value="5 days"
            subtitle="Keep it going!"
            icon={TrendingUp}
            variant="default"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <WorkoutCharts />
      </div>

      {/* Calendar */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <WorkoutCalendar />
      </div>
    </div>
  );
};

export default Dashboard;
