import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 60000, // 60 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.access) {
            config.headers['Authorization'] = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.refresh) {
                    const response = await axios.post(`${API_URL}/auth/refresh/`, {
                        refresh: user.refresh,
                    });
                    if (response.status === 200) {
                        user.access = response.data.access;
                        localStorage.setItem('user', JSON.stringify(user));
                        api.defaults.headers.common['Authorization'] = `Bearer ${user.access}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Handle refresh token failure (e.g., logout user)
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login/', { username: email, password }), // Note: Django usually expects 'username' but we might need to adjust based on serializer
    register: (userData) => api.post('/auth/register/', userData),
    getProfile: () => api.get('/auth/profile/'),
    getStudentProgress: () => api.get('/auth/progress/'),
    updateStudentProgress: (data) => api.post('/auth/progress/', data),
};

export const aiAPI = {
    generateQuestions: (config) => api.post('/gemini/', {
        action: 'generate_questions',
        ...config
    }),
    evaluateTest: (data) => api.post('/gemini/', {
        action: 'evaluate',
        ...data
    })
};

export default api;
