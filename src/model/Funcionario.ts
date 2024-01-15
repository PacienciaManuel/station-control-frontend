import Papel from "./Papel";
import Genero from "./Genero";
import Telefone from "./Telefone";
import Pais from "./Pais";

export default interface Funcionario {
    id?: string,
    nome: string,
    papel: Papel,
    email: string,
    genero: Genero,
    morada: string,
    telefone: Telefone,
    dataCriacao: string,
    nacionalidade: Pais,
    fotoPerfil?: string,
    dataNascimento: string,
    notaInformativa: string,
    bilheteIdentidade: string,
}