import Ocorrencia from "./Ocorrencia";

export default interface Arquivo {
    id: string,
    nome: string,
    url: string,
    tipo: string,
    dataArquivo: string,
    ocorrencia?: Ocorrencia,
}