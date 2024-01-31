import Pais from "./Pais";
import Genero from "./Genero";
import Telefone from "./Telefone";
import Ocorrencia from "./Ocorrencia";
import Funcionario from "./Funcionario";

export default interface Requerente {
    id: string,
    nome: string,
    genero: Genero,
    morada: string,
    dataCriacao: string,
    dataNascimento: string,
    bilheteIdentidade: string,
    totalOcorrencias: number,
    funcionario: Funcionario,
    fotoPerfil?: string,
    pais: Pais,
    telefone: Telefone,
    ocorrencias?: Ocorrencia[],
}
export interface RequerenteDTO {
    nome: string,
    genero: Genero,
    dataNascimento: string,
    morada: string,
    bilheteIdentidade: string,
} 