import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // Use centralized axios instance
import { useNavigate } from 'react-router-dom'; // Redirect users

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });

            localStorage.setItem('auth_token', response.data.access_token);
            await fetchUser();
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed',
                errors: error.response?.data?.errors 
            };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        try {
            await api.post('/register', { name, email, password, password_confirmation });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            setUser(null);
            navigate('/login'); // Redirect to login page
        }
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/user');
            setUser(response.data);
            localStorage.setItem('user_role', response.data.role); // Store role
        } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
