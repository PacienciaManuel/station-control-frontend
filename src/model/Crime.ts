import Funcionario from "./Funcionario";
import { OrderBy } from "./Pagination";

export const CRIME_ORDER_BY: OrderBy[] = [
    {label: "Nome", value: "nome"},
    {label: "Vigor", value: "vigor"},
    {label: "Duração da Pena", value: "duracaoPena"},
    {label: "Data de Criação", value: "dataCriacao"},
    {label: "Data de Atualização", value: "dataAtualizacao"},
];

export default interface Crime {
    id: string;
    nome: string,
    vigor: boolean,
    dataCriacao: string,
    dataAtualizacao: string,
    descricao: string,
    funcionario: Funcionario,
}

export interface CrimeDTO {
    nome: string,
    vigor: boolean,
    descricao: string,
}