import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Dumbbell, Save, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWorkout, CATEGORIES } from '@/contexts/WorkoutContext';
import { useToast } from '@/hooks/use-toast';

const PlanBuilder = () => {
  const { plans, addPlan, updatePlan, deletePlan, addExerciseToPlan, updateExercise, deleteExercise } = useWorkout();
  const { toast } = useToast();

  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);

  const [planForm, setPlanForm] = useState({ name: '', description: '' });
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    category: 'Chest',
    defaultSets: 3,
    defaultReps: 10,
    weight: 0,
  });

  const resetPlanForm = () => {
    setPlanForm({ name: '', description: '' });
    setEditingPlan(null);
  };

  const resetExerciseForm = () => {
    setExerciseForm({ name: '', category: 'Chest', defaultSets: 3, defaultReps: 10, weight: 0 });
    setEditingExercise(null);
  };

  const handleSavePlan = () => {
    if (!planForm.name.trim()) {
      toast({ title: 'Error', description: 'Plan name is required', variant: 'destructive' });
      return;
    }

    if (editingPlan) {
      updatePlan(editingPlan.id, { name: planForm.name, description: planForm.description });
      toast({ title: 'Success', description: 'Plan updated successfully' });
    } else {
      addPlan({ name: planForm.name, description: planForm.description, exercises: [] });
      toast({ title: 'Success', description: 'New plan created successfully' });
    }

    setIsPlanDialogOpen(false);
    resetPlanForm();
  };

  const handleSaveExercise = () => {
    if (!exerciseForm.name.trim() || !selectedPlanId) {
      toast({ title: 'Error', description: 'Exercise name is required', variant: 'destructive' });
      return;
    }

    if (editingExercise) {
      updateExercise(selectedPlanId, editingExercise.id, exerciseForm);
      toast({ title: 'Success', description: 'Exercise updated successfully' });
    } else {
      addExerciseToPlan(selectedPlanId, exerciseForm);
      toast({ title: 'Success', description: 'Exercise added successfully' });
    }

    setIsExerciseDialogOpen(false);
    resetExerciseForm();
  };

  const handleEditPlan = (plan) => {
    setEditingPlan({ id: plan.id, name: plan.name, description: plan.description });
    setPlanForm({ name: plan.name, description: plan.description });
    setIsPlanDialogOpen(true);
  };

  const handleEditExercise = (planId, exercise) => {
    setSelectedPlanId(planId);
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      category: exercise.category,
      defaultSets: exercise.defaultSets,
      defaultReps: exercise.defaultReps,
      weight: exercise.weight,
    });
    setIsExerciseDialogOpen(true);
  };

  const handleDeletePlan = (id) => {
    deletePlan(id);
    toast({ title: 'Deleted', description: 'Plan deleted successfully' });
  };

  const handleDeleteExercise = (planId, exerciseId) => {
    deleteExercise(planId, exerciseId);
    toast({ title: 'Deleted', description: 'Exercise removed successfully' });
  };

  const openAddExercise = (planId) => {
    setSelectedPlanId(planId);
    resetExerciseForm();
    setIsExerciseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Workout Plans</h1>
          <p className="text-muted-foreground">Create and manage your workout routines</p>
        </div>
        <Dialog open={isPlanDialogOpen} onOpenChange={(open) => { setIsPlanDialogOpen(open); if (!open) resetPlanForm(); }}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., Push Day, Full Body Workout"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea
                  id="plan-description"
                  placeholder="Describe your workout plan..."
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setIsPlanDialogOpen(false); resetPlanForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSavePlan} className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingPlan ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No workout plans yet</h3>
          <p className="text-muted-foreground mb-4">Create your first workout plan to get started</p>
          <Button variant="gradient" onClick={() => setIsPlanDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">{plan.description}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditPlan(plan)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between rounded-xl bg-secondary/50 p-3"
                    >
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.defaultSets}x{exercise.defaultReps} @ {exercise.weight}kg • {exercise.category}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditExercise(plan.id, exercise)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteExercise(plan.id, exercise.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => openAddExercise(plan.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Exercise Dialog */}
      <Dialog open={isExerciseDialogOpen} onOpenChange={(open) => { setIsExerciseDialogOpen(open); if (!open) resetExerciseForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                placeholder="e.g., Bench Press, Squats"
                value={exerciseForm.name}
                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise-category">Category</Label>
              <Select
                value={exerciseForm.category}
                onValueChange={(value) => setExerciseForm({ ...exerciseForm, category: value })}
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exercise-sets">Sets</Label>
                <Input
                  id="exercise-sets"
                  type="number"
                  min={1}
                  value={exerciseForm.defaultSets}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, defaultSets: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-reps">Reps</Label>
                <Input
                  id="exercise-reps"
                  type="number"
                  min={1}
                  value={exerciseForm.defaultReps}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, defaultReps: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exercise-weight">Weight (kg)</Label>
                <Input
                  id="exercise-weight"
                  type="number"
                  min={0}
                  value={exerciseForm.weight}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, weight: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setIsExerciseDialogOpen(false); resetExerciseForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveExercise} className="gap-2">
                <Save className="h-4 w-4" />
                {editingExercise ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanBuilder;
