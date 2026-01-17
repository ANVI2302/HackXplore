import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'student' | 'professional';
    title?: string;
    skills?: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Mock login - no credential validation
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email: email,
            role: 'student',
            title: 'Learning Developer',
            skills: [],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        navigate('/profile');
    };

    const register = async (email: string, name: string, password: string) => {
        // Mock registration - no database save
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
            role: 'student',
            title: '',
            skills: [],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        
        setUser(mockUser);
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        navigate('/profile');
    };

    const logout = () => {
        localStorage.removeItem('mock_user');
        setUser(null);
        navigate('/');
    };

    const updateUser = async (data: Partial<User>) => {
        if (!user) return;

        const updatedUser: User = {
            ...user,
            ...data
        };

        setUser(updatedUser);
        localStorage.setItem('mock_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
