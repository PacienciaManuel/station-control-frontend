import api from "./api";
import axios from "axios";
import Login from "@/model/Login";
import Usuario from "@/model/Funcionario";

interface LoginResponse {
    tipo: string,
    acesso: string,
    usuario: Usuario,
    atualizacao: string,
}

interface FrontendAuthorization {
    frontendAuthorization: string,
}

class LoginService {
    private static URL = '/login';

    login(login: Login) {
        return api.post<LoginResponse>(LoginService.URL, login);
    }

    frontendAuthorization(usuario: Usuario) {
        return axios.post<FrontendAuthorization>("/api/authorization", usuario);
    }
}

const loginService = new LoginService();

export default loginService;