import Funcionario from "./Funcionario";

export default interface Notificacao {
    id: string,
    titulo: string,
    descricao: string,
    dataNotificacao: string,
    dataAtualizacao: string,
    funcionario: Funcionario,
}

export interface NotificacaoDTO {
    titulo: string,
    descricao: string,
}