import React, { useState } from 'react';
import { Play, Plus, Minus, Save, Clock, Dumbbell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWorkout, CATEGORIES } from '@/contexts/WorkoutContext';
import { useToast } from '@/hooks/use-toast';

interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
}

const WorkoutLog: React.FC = () => {
  const { plans, addLog } = useWorkout();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLogging, setIsLogging] = useState(false);
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [notes, setNotes] = useState('');
  const [startTime] = useState(new Date());

  // Custom exercise form
  const [customExercise, setCustomExercise] = useState({
    name: '',
    category: 'Chest',
    sets: 3,
    reps: 10,
    weight: 0,
  });

  const startWorkout = () => {
    if (selectedPlan) {
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        setExercises(plan.exercises.map(ex => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          category: ex.category,
          sets: ex.defaultSets,
          reps: ex.defaultReps,
          weight: ex.weight,
          duration: 5,
        })));
      }
    }
    setIsLogging(true);
  };

  const addCustomExercise = () => {
    if (!customExercise.name.trim()) {
      toast({ title: 'Error', description: 'Exercise name is required', variant: 'destructive' });
      return;
    }

    setExercises([...exercises, {
      exerciseId: crypto.randomUUID(),
      exerciseName: customExercise.name,
      category: customExercise.category,
      sets: customExercise.sets,
      reps: customExercise.reps,
      weight: customExercise.weight,
      duration: 5,
    }]);

    setCustomExercise({ name: '', category: 'Chest', sets: 3, reps: 10, weight: 0 });
    toast({ title: 'Added', description: 'Exercise added to your workout' });
  };

  const updateExercise = (index: number, field: keyof LoggedExercise, value: number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: Math.max(0, value) };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveWorkout = () => {
    if (exercises.length === 0) {
      toast({ title: 'Error', description: 'Add at least one exercise', variant: 'destructive' });
      return;
    }

    const totalDuration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);

    addLog({
      date: new Date(),
      exercises,
      totalDuration: Math.max(totalDuration, exercises.reduce((acc, ex) => acc + ex.duration, 0)),
      notes: notes || undefined,
    });

    toast({
      title: 'Workout Saved! 🎉',
      description: `Great job! You completed ${exercises.length} exercises.`,
    });

    // Reset
    setIsLogging(false);
    setExercises([]);
    setNotes('');
    setSelectedPlan('');
  };

  if (!isLogging) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Start Workout</h1>
          <p className="text-muted-foreground">Log your exercises and track your progress</p>
        </div>

        <div className="glass-card rounded-2xl p-6 max-w-xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Choose a Workout Plan (Optional)</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan or start fresh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Start Fresh (No Plan)</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} ({plan.exercises.length} exercises)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="gradient" size="xl" className="w-full gap-2" onClick={startWorkout}>
              <Play className="h-6 w-6" />
              Start Workout
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 max-w-xl mx-auto">
          <h3 className="font-display text-lg font-semibold mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Select a plan to pre-load exercises, or start fresh
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Adjust sets, reps, and weights during your workout
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              Add custom exercises anytime
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <span className="animate-pulse">🔥</span> Workout in Progress
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4" />
            Started {startTime.toLocaleTimeString()}
          </p>
        </div>
        <Button variant="gradient" onClick={saveWorkout} className="gap-2">
          <Save className="h-5 w-5" />
          Finish & Save
        </Button>
      </div>

      {/* Current Exercises */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div key={exercise.exerciseId} className="glass-card rounded-2xl p-4 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{exercise.exerciseName}</h3>
                <span className="text-sm text-muted-foreground">{exercise.category}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeExercise(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Sets</Label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateExercise(index, 'sets', exercise.sets - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-bold">{exercise.sets}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateExercise(index, 'sets', exercise.sets + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reps</Label>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateExercise(index, 'reps', exercise.reps - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-bold">{exercise.reps}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateExercise(index, 'reps', exercise.reps + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Weight (kg)</Label>
                <Input
                  type="number"
                  min={0}
                  value={exercise.weight}
                  onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value) || 0)}
                  className="h-8 text-center"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={exercise.duration}
                  onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value) || 1)}
                  className="h-8 text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Exercise */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Add Exercise
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <Label>Exercise Name</Label>
            <Input
              placeholder="e.g., Bench Press"
              value={customExercise.name}
              onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={customExercise.category}
              onValueChange={(value) => setCustomExercise({ ...customExercise, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Sets</Label>
            <Input
              type="number"
              min={1}
              value={customExercise.sets}
              onChange={(e) => setCustomExercise({ ...customExercise, sets: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <Label>Reps</Label>
            <Input
              type="number"
              min={1}
              value={customExercise.reps}
              onChange={(e) => setCustomExercise({ ...customExercise, reps: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addCustomExercise} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card rounded-2xl p-6">
        <Label htmlFor="notes">Workout Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="How did your workout feel? Any PRs?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default WorkoutLog;
