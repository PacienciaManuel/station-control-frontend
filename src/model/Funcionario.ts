import Papel from "./Papel";
import Genero from "./Genero";
import Telefone from "./Telefone";

export default interface Funcionario {
    id?: string,
    nome: string,
    papel: Papel,
    email: string,
    genero: Genero,
    endereco: string,
    telefone: Telefone,
    dataCriacao: string,
    fotoPerfil?: string,
    dataNascimento: string,
    notaInformativa: string,
}