import Pais from "./Pais";
import Genero from "./Genero";
import Ocorrencia from "./Ocorrencia";
import { OrderBy } from "./Pagination";
import Telefone, { TelefoneDTO } from "./Telefone";

export const SUSPECT_ORDER_BY: OrderBy[] = [
    {label: "Nome", value: "nome"},
    {label: "Gênero", value: "genero"},
    {label: "Data de Nascimento", value: "dataNascimento"},
    {label: "Pais", value: "pais.nome"},
    {label: "Morada", value: "morada"},
];

export default interface Suspeito {
    id: string,
    nome: string,
    email: string,
    genero: Genero,
    morada: string,
    detido: boolean,
    dataCriacao: string,
    dataAtualzacao: string,
    dataNascimento: string,
    totalOcorrencias: number,
    bilheteIdentidade: string,
    telefone?: Telefone,
    foto?: string,
    pais: Pais,
    biografia: string,
    ocorrencias?: Ocorrencia[],
}

export interface SuspeitoDTO extends TelefoneDTO {
    nome: string,
    genero: string,
    dataNascimento: string,
    morada: string,
    detido: boolean,
    bilheteIdentidade: string,
    biografia: string,
}

export interface SuspeitoUpdateDTO {
    nome: string,
    genero: string,
    dataNascimento: string,
    morada: string,
    detido: boolean,
    bilheteIdentidade: string,
    biografia: string,
}