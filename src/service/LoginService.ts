import api from "./api";
import axios from "axios";
import Login from "@/model/Login";
import LoginResponse from "@/model/LoginResponse";


interface FrontendAuthorization {
    frontendAuthorization: string,
}

class LoginService {
    private static URL = '/login';

    login(login: Login) {
        return api.post<LoginResponse>(LoginService.URL, login);
    }

    frontendAuthorization(loginResponse: LoginResponse) {
        return axios.post<FrontendAuthorization>("/api/authorization", loginResponse);
    }
}

const loginService = new LoginService();

export default loginService;