import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading] = useState(false);
  // Store pending signups in localStorage for persistence across reloads
  const [pendingUsers, setPendingUsers] = useState(() => {
    const saved = localStorage.getItem('pendingUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // Save pending users whenever they change
  useEffect(() => {
    localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const login = (email, password) => {
    // Admin Login
    if (email === 'admin@example.com' && password === 'admin123') {
      const userData = { name: 'Admin User', email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    
    // Check if user is in pending list
    const pending = pendingUsers.find(u => u.email === email && u.password === password);
    if (pending) {
      if (pending.status === 'approved') {
         const userData = { name: pending.name, email: pending.email, role: 'user' };
         setUser(userData);
         localStorage.setItem('user', JSON.stringify(userData));
         return { success: true };
      } else {
        return { success: false, message: 'Account pending admin approval.' };
      }
    }

    return { success: false, message: 'Invalid credentials.' };
  };

  const signup = (name, email, password) => {
    if (pendingUsers.find(u => u.email === email)) {
        return { success: false, message: 'Email already exists.' };
    }
    
    const newUser = { 
        id: Date.now(), 
        name, 
        email, 
        password, 
        status: 'pending', 
        createdAt: new Date().toISOString() 
    };
    
    setPendingUsers(prev => [...prev, newUser]);
    return { success: true, message: 'Signup successful! Please wait for admin approval.' };
  };

  const addUser = (name, email, password) => {
    if (pendingUsers.find(u => u.email === email)) {
        return { success: false, message: 'Email already exists.' };
    }
    
    const newUser = { 
        id: Date.now(), 
        name, 
        email, 
        password, 
        status: 'approved', 
        createdAt: new Date().toISOString() 
    };
    
    setPendingUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const approveUser = (userId) => {
    setPendingUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'approved' } : u
    ));
  };
  
  const rejectUser = (userId) => {
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        signup, 
        addUser,
        loading, 
        pendingUsers, 
        approveUser, 
        rejectUser 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
