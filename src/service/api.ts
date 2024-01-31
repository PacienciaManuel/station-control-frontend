import axios from 'axios';
import sessionManager from '@/util/SessionManager';
import LoginResponse from '@/model/LoginResponse';

let fetchingRefreshToken = false;
// export const API_BASE_URL = `http://192.168.1.104:8080`;
export const API_BASE_URL = `http://localhost:8080`;
export const RESOUCES_API_BASE_URL = `${API_BASE_URL}/resources`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept-Language': 'pt-PT',
    }
});

api.interceptors.request.use(config => {
    config.headers.Authorization = sessionManager.accessToken();
    return config;
});

// api.interceptors.response.use((response) => response, async function (error) {
//         const originalRequest = error.config;
//         if (error.response.status === 403 && !fetchingRefreshToken) {
//             fetchingRefreshToken = true;
//             console.log("ERROR UNAUTHORIZED: ", error);
//             originalRequest._retry = true;
//             const response = await api.post<LoginResponse>(`${API_BASE_URL}/authentication/refresh`, {authorization: sessionManager.accessToken()});
//             console.log("==========> RESPONSE: ", response);
//             const data = response.data;
//             sessionManager.refreshSession({apiAccessToken: data.acesso, apiRefreshToken: data.atualizacao, apiTokenType: data.tipo});
//             fetchingRefreshToken = false;
//             api.defaults.headers.common["Authorization"] = `${data.tipo} ${data.acesso}`;
//             return api(originalRequest);
//         }
//         return Promise.reject(error);
//     }
// );

export default api;