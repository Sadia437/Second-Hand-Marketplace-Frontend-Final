import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(); 

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      setDbUser(null);
      localStorage.removeItem('token');
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      const token = localStorage.getItem('token');

      
      if (user?.email && token && !dbUser) {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });    
          if (res.data) {
            setDbUser(res.data);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          if (error.response?.status === 401) localStorage.removeItem('token');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dbUser]);

  const value = {
    currentUser,
    dbUser, 
    setDbUser,
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout,
    googleSignIn: () => signInWithPopup(auth, new GoogleAuthProvider()),
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}