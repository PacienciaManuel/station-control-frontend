import axios from 'axios';
import sessionManager from '@/util/SessionManager';

export const API_BASE_URL = `http://192.168.1.104:8080`;
// export const API_BASE_URL = `http://localhost:8080`;
export const RESOUCES_API_BASE_URL = `${API_BASE_URL}/resources`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept-Language': 'pt-PT',
    }
});

api.interceptors.request.use(config => {
    console.log("================> INTERCEPTOR", sessionManager.accessToken());
    config.headers.Authorization = sessionManager.accessToken();
    return config;
})

export default api;