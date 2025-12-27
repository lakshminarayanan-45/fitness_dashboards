import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  defaultSets: number;
  defaultReps: number;
  weight: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdAt: Date;
}

export interface WorkoutLog {
  id: string;
  date: Date;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    category: string;
    sets: number;
    reps: number;
    weight: number;
    duration: number; // in minutes
  }[];
  totalDuration: number;
  notes?: string;
}

interface WorkoutContextType {
  plans: WorkoutPlan[];
  logs: WorkoutLog[];
  addPlan: (plan: Omit<WorkoutPlan, 'id' | 'createdAt'>) => void;
  updatePlan: (id: string, plan: Partial<WorkoutPlan>) => void;
  deletePlan: (id: string) => void;
  addExerciseToPlan: (planId: string, exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (planId: string, exerciseId: string, exercise: Partial<Exercise>) => void;
  deleteExercise: (planId: string, exerciseId: string) => void;
  addLog: (log: Omit<WorkoutLog, 'id'>) => void;
  updateLog: (id: string, log: Partial<WorkoutLog>) => void;
  deleteLog: (id: string) => void;
  getWeeklyWorkouts: () => number;
  getTotalTime: () => number;
  getTotalVolume: () => { sets: number; reps: number };
  getChartData: () => { lineData: any[]; barData: any[] };
  getCalendarData: () => Map<string, WorkoutLog[]>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const CATEGORIES = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

// Generate sample data
const generateSampleData = () => {
  const samplePlans: WorkoutPlan[] = [
    {
      id: '1',
      name: 'Push Day',
      description: 'Chest, shoulders, and triceps workout',
      exercises: [
        { id: '1', name: 'Bench Press', category: 'Chest', defaultSets: 4, defaultReps: 10, weight: 60 },
        { id: '2', name: 'Shoulder Press', category: 'Shoulders', defaultSets: 3, defaultReps: 12, weight: 25 },
        { id: '3', name: 'Tricep Dips', category: 'Arms', defaultSets: 3, defaultReps: 15, weight: 0 },
      ],
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Pull Day',
      description: 'Back and biceps workout',
      exercises: [
        { id: '4', name: 'Deadlift', category: 'Back', defaultSets: 4, defaultReps: 8, weight: 80 },
        { id: '5', name: 'Pull Ups', category: 'Back', defaultSets: 3, defaultReps: 10, weight: 0 },
        { id: '6', name: 'Bicep Curls', category: 'Arms', defaultSets: 3, defaultReps: 12, weight: 15 },
      ],
      createdAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      name: 'Leg Day',
      description: 'Complete lower body workout',
      exercises: [
        { id: '7', name: 'Squats', category: 'Legs', defaultSets: 4, defaultReps: 10, weight: 70 },
        { id: '8', name: 'Leg Press', category: 'Legs', defaultSets: 3, defaultReps: 12, weight: 100 },
        { id: '9', name: 'Lunges', category: 'Legs', defaultSets: 3, defaultReps: 10, weight: 20 },
      ],
      createdAt: new Date('2024-01-03'),
    },
  ];

  const sampleLogs: WorkoutLog[] = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    if (Math.random() > 0.3) { // 70% chance of having a workout
      const planIndex = i % 3;
      const plan = samplePlans[planIndex];
      
      sampleLogs.push({
        id: `log-${i}`,
        date: date,
        exercises: plan.exercises.map(ex => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          category: ex.category,
          sets: ex.defaultSets + Math.floor(Math.random() * 2),
          reps: ex.defaultReps + Math.floor(Math.random() * 3),
          weight: ex.weight + Math.floor(Math.random() * 5),
          duration: 5 + Math.floor(Math.random() * 10),
        })),
        totalDuration: 45 + Math.floor(Math.random() * 30),
        notes: i === 0 ? 'Great session today!' : undefined,
      });
    }
  }

  return { samplePlans, sampleLogs };
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    const savedPlans = localStorage.getItem('fitness-plans');
    const savedLogs = localStorage.getItem('fitness-logs');

    if (savedPlans && savedLogs) {
      setPlans(JSON.parse(savedPlans, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }));
      setLogs(JSON.parse(savedLogs, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }));
    } else {
      const { samplePlans, sampleLogs } = generateSampleData();
      setPlans(samplePlans);
      setLogs(sampleLogs);
      localStorage.setItem('fitness-plans', JSON.stringify(samplePlans));
      localStorage.setItem('fitness-logs', JSON.stringify(sampleLogs));
    }
  }, []);

  const savePlans = (newPlans: WorkoutPlan[]) => {
    setPlans(newPlans);
    localStorage.setItem('fitness-plans', JSON.stringify(newPlans));
  };

  const saveLogs = (newLogs: WorkoutLog[]) => {
    setLogs(newLogs);
    localStorage.setItem('fitness-logs', JSON.stringify(newLogs));
  };

  const addPlan = (plan: Omit<WorkoutPlan, 'id' | 'createdAt'>) => {
    const newPlan: WorkoutPlan = {
      ...plan,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    savePlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, planData: Partial<WorkoutPlan>) => {
    savePlans(plans.map(p => p.id === id ? { ...p, ...planData } : p));
  };

  const deletePlan = (id: string) => {
    savePlans(plans.filter(p => p.id !== id));
  };

  const addExerciseToPlan = (planId: string, exercise: Omit<Exercise, 'id'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: crypto.randomUUID(),
    };
    savePlans(plans.map(p => 
      p.id === planId 
        ? { ...p, exercises: [...p.exercises, newExercise] }
        : p
    ));
  };

  const updateExercise = (planId: string, exerciseId: string, exerciseData: Partial<Exercise>) => {
    savePlans(plans.map(p => 
      p.id === planId 
        ? { 
            ...p, 
            exercises: p.exercises.map(e => 
              e.id === exerciseId ? { ...e, ...exerciseData } : e
            )
          }
        : p
    ));
  };

  const deleteExercise = (planId: string, exerciseId: string) => {
    savePlans(plans.map(p => 
      p.id === planId 
        ? { ...p, exercises: p.exercises.filter(e => e.id !== exerciseId) }
        : p
    ));
  };

  const addLog = (log: Omit<WorkoutLog, 'id'>) => {
    const newLog: WorkoutLog = {
      ...log,
      id: crypto.randomUUID(),
    };
    saveLogs([newLog, ...logs]);
  };

  const updateLog = (id: string, logData: Partial<WorkoutLog>) => {
    saveLogs(logs.map(l => l.id === id ? { ...l, ...logData } : l));
  };

  const deleteLog = (id: string) => {
    saveLogs(logs.filter(l => l.id !== id));
  };

  const getWeeklyWorkouts = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logs.filter(l => new Date(l.date) >= weekAgo).length;
  };

  const getTotalTime = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logs
      .filter(l => new Date(l.date) >= weekAgo)
      .reduce((acc, l) => acc + l.totalDuration, 0);
  };

  const getTotalVolume = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyLogs = logs.filter(l => new Date(l.date) >= weekAgo);
    
    return weeklyLogs.reduce((acc, log) => {
      log.exercises.forEach(ex => {
        acc.sets += ex.sets;
        acc.reps += ex.sets * ex.reps;
      });
      return acc;
    }, { sets: 0, reps: 0 });
  };

  const getChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const lineData = [];
    const barData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayLogs = logs.filter(l => {
        const logDate = new Date(l.date);
        return logDate.toDateString() === date.toDateString();
      });

      const totalDuration = dayLogs.reduce((acc, l) => acc + l.totalDuration, 0);
      const totalVolume = dayLogs.reduce((acc, log) => {
        return acc + log.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * ex.weight), 0);
      }, 0);

      lineData.push({
        day: days[date.getDay()],
        duration: totalDuration,
        volume: totalVolume,
      });

      barData.push({
        day: days[date.getDay()],
        workouts: dayLogs.length,
        duration: totalDuration,
      });
    }

    return { lineData, barData };
  };

  const getCalendarData = () => {
    const calendarMap = new Map<string, WorkoutLog[]>();
    logs.forEach(log => {
      const dateKey = new Date(log.date).toISOString().split('T')[0];
      const existing = calendarMap.get(dateKey) || [];
      calendarMap.set(dateKey, [...existing, log]);
    });
    return calendarMap;
  };

  return (
    <WorkoutContext.Provider value={{
      plans,
      logs,
      addPlan,
      updatePlan,
      deletePlan,
      addExerciseToPlan,
      updateExercise,
      deleteExercise,
      addLog,
      updateLog,
      deleteLog,
      getWeeklyWorkouts,
      getTotalTime,
      getTotalVolume,
      getChartData,
      getCalendarData,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export { CATEGORIES };
