import Funcionario from "./Funcionario";
import Notificacao from "./Notificacao";

export default interface NotificacaoFuncionario extends Notificacao {
    visto: boolean,
    dataVisto: string,
    funcionarioDestino: Funcionario,
}