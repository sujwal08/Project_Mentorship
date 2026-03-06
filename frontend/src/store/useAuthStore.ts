import { create } from 'zustand';
import { api } from '../api/axios';

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('demotrade_token'),
    isLoading: true,
    login: (token, user) => {
        localStorage.setItem('demotrade_token', token);
        set({ token, user, isLoading: false });
    },
    logout: () => {
        localStorage.removeItem('demotrade_token');
        set({ token: null, user: null, isLoading: false });
    },
    checkAuth: async () => {
        const token = localStorage.getItem('demotrade_token');
        if (!token) {
            set({ isLoading: false });
            return;
        }

        try {
            const res = await api.get('/auth/me');
            set({ user: res.data.user, token, isLoading: false });
        } catch (error) {
            localStorage.removeItem('demotrade_token');
            set({ token: null, user: null, isLoading: false });
        }
    }
}));
