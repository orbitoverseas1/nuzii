"use client";

import { auth } from "@/lib/firebase";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    googleLogin: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const googleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            toast.success("Successfully signed in!");
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Failed to sign in with Google");
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Successfully signed out!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to sign out");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
