import Arquivo from "./Arquivo";
import Crime from "./Crime";
import Funcionario from "./Funcionario";
import Requerente from "./Requerente";
import Status from "./Status";
import Suspeito from "./Suspeito";

export default interface Ocorrencia {
    id: string,
    status: Status,
    descricao: string,
    dataOcorrencia: string,
    dataCriacao: string,
    dataAtualizacao: string,
    totalArquivos: number,
    totalObjectos: number,
    totalCrimes: number,
    totalSuspeitos: number,
    requerente: Requerente,
    funcionario: Funcionario,
    arquivos?: Arquivo[],
    objectos?: string[],
    crimes?: Crime[],
    suspeitos?: Suspeito[],
}
export interface OcorrenciaDTO {
    status: Status,
    descricao: string,
    dataOcorrencia: string,
} 