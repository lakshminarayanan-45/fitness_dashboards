import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkout } from '@/contexts/WorkoutContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WorkoutCalendar = () => {
  const { getCalendarData } = useWorkout();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkouts, setSelectedWorkouts] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const calendarData = getCalendarData();

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const workouts = calendarData.get(dateStr);
    if (workouts && workouts.length > 0) {
      setSelectedWorkouts(workouts);
      setSelectedDate(new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Workout Calendar
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateMonth('prev')}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center font-medium text-foreground">{monthYear}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateMonth('next')}
            className="hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasWorkout = calendarData.has(dateStr);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-200 relative group",
                "hover:bg-secondary hover:scale-105",
                isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                hasWorkout && "bg-primary/10 hover:bg-primary/20"
              )}
            >
              <span className={cn(
                "font-medium",
                isToday && "text-primary font-bold",
                hasWorkout && "text-primary"
              )}>
                {day}
              </span>
              {hasWorkout && (
                <Flame className="h-3 w-3 text-primary absolute bottom-1 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={!!selectedWorkouts} onOpenChange={() => setSelectedWorkouts(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedWorkouts?.map((workout, idx) => (
              <div key={idx} className="glass-card rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-primary flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    {workout.totalDuration} min workout
                  </span>
                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {workout.exercises.length} exercises
                  </span>
                </div>
                <div className="space-y-2">
                  {workout.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <span className="font-medium">{ex.exerciseName}</span>
                      <span className="text-muted-foreground">
                        {ex.sets}x{ex.reps} @ {ex.weight}kg
                      </span>
                    </div>
                  ))}
                </div>
                {workout.notes && (
                  <p className="mt-3 text-sm text-muted-foreground italic bg-secondary/50 p-2 rounded-lg">
                    "{workout.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutCalendar;
