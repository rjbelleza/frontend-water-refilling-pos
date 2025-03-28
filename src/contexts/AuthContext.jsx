import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; 
import { useNavigate } from 'react-router-dom'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
    
            localStorage.setItem('auth_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
    
            setUser(response.data.user); // Set user in React state
            return { success: true, user: response.data.user };
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
            localStorage.removeItem('user');
            setUser(null);
            navigate('/'); 
        }
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }
    
        try {
            const response = await api.get('/user'); // Ensure your API returns user data
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data)); // Store full user data
        } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
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
