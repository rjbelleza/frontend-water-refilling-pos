import axios from 'axios';

const api = axios.create({
    baseURL: 'https://aquasprings-pos-api.onrender.com/api',
});

// Attach Authorization token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors (Unauthorized) and auto-logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token'); // Clear token
            localStorage.removeItem('user_role'); // Clear role
            window.location.href = '/'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;
