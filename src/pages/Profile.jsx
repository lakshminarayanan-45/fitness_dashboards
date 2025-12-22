import React, { useState } from 'react';
import { User, Mail, Target, Save, LogOut, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    fitnessGoal: user?.fitnessGoal || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      fitnessGoal: formData.fitnessGoal,
    });
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast({
      title: 'Logged Out',
      description: 'See you next time! 👋',
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Avatar Section */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="relative inline-block">
          <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center mx-auto">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-primary-foreground" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background hover:bg-secondary/80 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">{user?.name}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>

      {/* Profile Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold">Account Details</h3>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="pl-10 bg-secondary/50"
              />
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal (Optional)</Label>
            <div className="relative">
              <Target className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Textarea
                id="fitnessGoal"
                placeholder="e.g., Build muscle, lose weight, improve endurance..."
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                disabled={!isEditing}
                className="pl-10 min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-muted-foreground">Workouts</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-accent">8hrs</p>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-secondary/50">
            <p className="text-2xl font-bold text-success">5</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full gap-2"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        Log Out
      </Button>
    </div>
  );
};

export default Profile;
