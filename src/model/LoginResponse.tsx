import Funcionario from "./Funcionario";

export default interface LoginResponse {
    tipo: string,
    acesso: string,
    funcionario: Funcionario,
    atualizacao: string,
}