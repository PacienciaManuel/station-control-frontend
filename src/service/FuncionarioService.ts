import api from "./api";
import { GENERO } from "@/model/Genero";
import Papel, { PAPEL } from "@/model/Papel";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";
import Funcionario, { FuncionarioUpdateDTO, FuncionarioUpdateEmailDTO } from "@/model/Funcionario";

interface EmployeeFilter {
    pais?: string,
    nome?: string,
    papel?: PAPEL,
    email?: string,
    genero?: GENERO,
    dataNascimento?: string,
}

class FuncionarioService {
    private static URL = '/funcionarios';
    
    findByAll({nome="", genero="" as GENERO, dataNascimento="", email="", papel="" as PAPEL, pais="", orderBy="dataCriacao", direction=Direction.ASC}:EmployeeFilter & Sort){
        return api.get<Funcionario>(`${FuncionarioService.URL}?nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&email=${email}&papel=${papel}&pais=${pais}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idFuncionario:string){
        return api.get<Funcionario>(`${FuncionarioService.URL}/${idFuncionario}`);
    };
    
    count(papel?:Papel){
        return api.get<number>(`${FuncionarioService.URL}/contador?papel=${papel || ""}`);
    };
    
    pagination({page, size, nome="", genero="" as GENERO, dataNascimento="", email="", papel="" as PAPEL, pais="", orderBy="dataCriacao", direction=Direction.ASC}:EmployeeFilter & Pagination){
        return api.get<PaginationResponse<Funcionario>>(`${FuncionarioService.URL}/paginacao?page=${page}&size=${size}&nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&email=${email}&papel=${papel}&pais=${pais}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(idPais:string, formData: FormData){
        return api.post<Funcionario>(`${FuncionarioService.URL}/${idPais}`, formData);
    };
    
    update(idFuncionario:string, idPais:string, funcionarioUpdate: FuncionarioUpdateDTO){
        return api.put<Funcionario>(`${FuncionarioService.URL}/${idFuncionario}/${idPais}`, funcionarioUpdate);
    };
    
    updateEmail(idFuncionario:string, funcionarioUpdateEmailDTO: FuncionarioUpdateEmailDTO){
        return api.patch<Funcionario>(`${FuncionarioService.URL}/email/${idFuncionario}`, funcionarioUpdateEmailDTO);
    };
    
    updateProfilePhoto(idFuncionario:string, formData: FormData){
        return api.patch<Funcionario>(`${FuncionarioService.URL}/fotoPerfil/${idFuncionario}`, formData);
    };

    delete(idFuncionario:string){
        return api.delete<Funcionario>(`${FuncionarioService.URL}/${idFuncionario}`);
    };
}

const funcionarioService = new FuncionarioService();

export default funcionarioService;