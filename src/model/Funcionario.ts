import Pais from "./Pais";
import Papel from "./Papel";
import Genero from "./Genero";
import Telefone, { TelefoneDTO } from "./Telefone";
import Ocorrencia from "./Ocorrencia";
import { OrderBy } from "./Pagination";

export const EMPLOYEE_ORDER_BY: OrderBy[] = [
    {label: "Nome", value: "nome"},
    {label: "Gênero", value: "genero"},
    {label: "Data de Nascimento", value: "dataNascimento"},
    {label: "Email", value: "email"},
    {label: "Pais", value: "pais.nome"},
    {label: "Morada", value: "morada"},
];

export default interface Funcionario {
    id: string,
    nome: string,
    papel: Papel,
    email: string,
    genero: Genero,
    morada: string,
    dataCriacao: string,
    fotoPerfil?: string,
    dataNascimento: string,
    biografia: string,
    totalRequerentes: number,
    totalSuspeitos: number,
    totalOcorrencias: number,
    totalSuspeitosOcorrencias: number,
    pais: Pais,
    telefones: Telefone[],
    ocorrencias?: Ocorrencia[],
}

export interface FuncionarioDTO extends TelefoneDTO {
    nome: string,
    genero: string,
    dataNascimento: string,
    email: string,
    morada: string,
    papel: string,
    biografia: string,
    senha: string,
    fotoPerfil?: File,
}

export interface FuncionarioUpdateDTO {
    nome: string,
    genero: string,
    morada: string,
    dataNascimento: string,
    biografia: string,
}

export interface FuncionarioUpdateEmailDTO {
    email: string,
    senha: Genero,
}