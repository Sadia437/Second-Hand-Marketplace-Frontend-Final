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
      localStorage.removeItem('access-token'); 
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user?.email) {
        try {
          const token = localStorage.getItem('access-token');
          if (token) {
            const res = await axios.get(`https://second-hand-marketplace-backend-final.onrender.com/api/users/profile`, {
              headers: { Authorization: `Bearer ${token}` }
            });    
            if (res.data) setDbUser(res.data);
          }
        } catch (error) {
          console.error("User fetch error:", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    dbUser, 
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