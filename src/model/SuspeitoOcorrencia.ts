import Funcionario from "./Funcionario";
import Ocorrencia from "./Ocorrencia";
import Suspeito from "./Suspeito";

export default interface SuspeitoOcorrencia {
    id: string, 
    descricao: string, 
    dataCriacao: string, 
    ocorrencia: Ocorrencia, 
    suspeito: Suspeito, 
    funcionario: Funcionario
}
export interface SuspeitoOcorrenciaDTO {
    descricao: string, 
    suspeito: string,
}