import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, Edit2, Trash2, BarChart3, Clock, Dumbbell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useWorkout, CATEGORIES } from '@/contexts/WorkoutContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const History = () => {
  const { logs, updateLog, deleteLog } = useWorkout();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [exerciseFilter, setExerciseFilter] = useState('');
  const [editingLog, setEditingLog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Get unique exercise names from all logs
  const allExercises = useMemo(() => {
    const exercises = new Set();
    logs.forEach(log => {
      log.exercises.forEach(ex => exercises.add(ex.exerciseName));
    });
    return Array.from(exercises).sort();
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Date filter
      if (dateFilter) {
        const logDate = format(new Date(log.date), 'yyyy-MM-dd');
        if (logDate !== dateFilter) return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        const hasCategory = log.exercises.some(ex => ex.category === categoryFilter);
        if (!hasCategory) return false;
      }

      // Exercise filter
      if (exerciseFilter) {
        const hasExercise = log.exercises.some(ex =>
          ex.exerciseName.toLowerCase().includes(exerciseFilter.toLowerCase())
        );
        if (!hasExercise) return false;
      }

      return true;
    });
  }, [logs, dateFilter, categoryFilter, exerciseFilter]);

  const clearFilters = () => {
    setDateFilter('');
    setCategoryFilter('all');
    setExerciseFilter('');
  };

  const handleDelete = (id) => {
    deleteLog(id);
    setDeleteConfirm(null);
    toast({ title: 'Deleted', description: 'Workout log deleted successfully' });
  };

  const handleSaveEdit = () => {
    if (editingLog) {
      updateLog(editingLog.id, editingLog);
      setEditingLog(null);
      toast({ title: 'Updated', description: 'Workout log updated successfully' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Workout History</h1>
          <p className="text-muted-foreground">Review and manage your past workouts</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
          <BarChart3 className="h-5 w-5" />
          View Charts
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filters</h3>
          {(dateFilter || categoryFilter !== 'all' || exerciseFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Exercise</Label>
            <Input
              placeholder="Search exercise..."
              value={exerciseFilter}
              onChange={(e) => setExerciseFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Logs */}
      {filteredLogs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No workouts found</h3>
          <p className="text-muted-foreground">
            {logs.length === 0
              ? 'Start logging workouts to see your history here'
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-display text-lg font-semibold">
                      {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {log.totalDuration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      {log.exercises.length} exercises
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingLog(log)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(log.id)}>
                    <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {log.exercises.map((ex, idx) => (
                  <div key={idx} className="rounded-xl bg-secondary/50 p-3">
                    <p className="font-medium">{ex.exerciseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {ex.sets}x{ex.reps} @ {ex.weight}kg • {ex.category}
                    </p>
                  </div>
                ))}
              </div>

              {log.notes && (
                <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
                  {log.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingLog} onOpenChange={() => setEditingLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Workout</DialogTitle>
          </DialogHeader>
          {editingLog && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Total Duration (minutes)</Label>
                <Input
                  type="number"
                  value={editingLog.totalDuration}
                  onChange={(e) => setEditingLog({
                    ...editingLog,
                    totalDuration: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Exercises</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editingLog.exercises.map((ex, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2 p-2 rounded-lg bg-secondary/50">
                      <Input
                        value={ex.exerciseName}
                        onChange={(e) => {
                          const updated = [...editingLog.exercises];
                          updated[idx] = { ...updated[idx], exerciseName: e.target.value };
                          setEditingLog({ ...editingLog, exercises: updated });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => {
                          const updated = [...editingLog.exercises];
                          updated[idx] = { ...updated[idx], sets: parseInt(e.target.value) || 0 };
                          setEditingLog({ ...editingLog, exercises: updated });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => {
                          const updated = [...editingLog.exercises];
                          updated[idx] = { ...updated[idx], reps: parseInt(e.target.value) || 0 };
                          setEditingLog({ ...editingLog, exercises: updated });
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={ex.weight}
                        onChange={(e) => {
                          const updated = [...editingLog.exercises];
                          updated[idx] = { ...updated[idx], weight: parseInt(e.target.value) || 0 };
                          setEditingLog({ ...editingLog, exercises: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingLog(null)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this workout log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default History;
