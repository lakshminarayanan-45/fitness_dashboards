import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('fitness-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6) {
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
      };
      setUser(newUser);
      localStorage.setItem('fitness-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const loginWithGoogle = async () => {
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      id: crypto.randomUUID(),
      email: 'user@gmail.com',
      name: 'Fitness Enthusiast',
      avatar: 'https://ui-avatars.com/api/?name=Fitness+Enthusiast&background=FF6B35&color=fff',
    };
    setUser(newUser);
    localStorage.setItem('fitness-user', JSON.stringify(newUser));
    return true;
  };

  const register = async (email, password, name) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6 && name) {
      const newUser = {
        id: crypto.randomUUID(),
        email,
        name,
      };
      setUser(newUser);
      localStorage.setItem('fitness-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitness-user');
  };

  const updateProfile = (data) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('fitness-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      loginWithGoogle, 
      register, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
