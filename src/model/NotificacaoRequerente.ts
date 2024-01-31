import Funcionario from "./Funcionario";
import Notificacao from "./Notificacao";
import Requerente from "./Requerente";

export default interface NotificacaoRequerente extends Notificacao {
    recebido: boolean,
    dataVisto: string,
    requerente: Requerente,
}