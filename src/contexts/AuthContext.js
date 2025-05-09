import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    userId: currentUser ? currentUser.uid : null,
    displayName: currentUser ? currentUser.displayName : null,
    email: currentUser ? currentUser.email : null,
    photoURL: currentUser ? currentUser.photoURL : null,
    isGoogleUser: currentUser
      ? currentUser.providerData.some(
          (provider) => provider.providerId === "google.com"
        )
      : false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
