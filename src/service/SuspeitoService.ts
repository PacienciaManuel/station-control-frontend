import api from "./api";
import { GENERO } from "@/model/Genero";
import Suspeito, { SuspeitoDTO, SuspeitoUpdateDTO } from "@/model/Suspeito";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class SuspeitoService {
    private static URL = '/suspeitos';
    
    findAll({funcionario="", nome="", genero="" as GENERO, dataNascimento="", morada="", detido="" as "false", pais="", orderBy="nome", direction=Direction.ASC}:{funcionario?: string, nome?: string, genero?: GENERO, dataNascimento?: string, morada?: string, detido?: "true" | "false", pais?: string} & Sort) {
        return api.get<Suspeito[]>(`${SuspeitoService.URL}?funcionario=${funcionario}&nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&morada=${morada}&detido=${detido}&pais=${pais}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idSuspeito: string) {
        return api.get<Suspeito>(`${SuspeitoService.URL}/${idSuspeito}`);
    };
    
    count({funcionario="", pais="", genero="" as GENERO, detido="" as "false"}:{funcionario?: string, pais?: string, genero?: "MASCULINO" | "FEMININO", detido?: "true" | "false"}){
        return api.get<number>(`${SuspeitoService.URL}/contador?funcionario=${funcionario}&pais=${pais}&genero=${genero}&detido=${detido}`);
    };
    
    pagination({page, size, funcionario="", nome="", genero="" as GENERO, dataNascimento="", morada="", detido="" as "false", pais="", orderBy="nome", direction=Direction.ASC}:{funcionario?: string, nome?: string, genero?: GENERO, dataNascimento?: string, morada?: string, detido?: "true" | "false", pais?: string} & Pagination) {
        return api.get<PaginationResponse<Suspeito>>(`${SuspeitoService.URL}/paginacao?page=${page}&size=${size}&funcionario=${funcionario}&nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&morada=${morada}&detido=${detido}&pais=${pais}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(idFuncionario: string, idPais: string, formData: FormData){
        return api.post<Suspeito>(`${SuspeitoService.URL}/${idFuncionario}/${idPais}`, formData);
    };
    
    update(idSuspeito: string, idPais: string, Suspeito: SuspeitoUpdateDTO) {
        return api.put<Suspeito>(`${SuspeitoService.URL}/${idSuspeito}/${idPais}`, Suspeito);
    };
    
    updatePhoto(idSuspeito: string, formData: FormData) {
        return api.patch<Suspeito>(`${SuspeitoService.URL}/foto/${idSuspeito}`, formData);
    };
    
    delete(idSuspeito: string) {
        return api.delete<Suspeito>(`${SuspeitoService.URL}/${idSuspeito}`);
    };
}

const suspeitoService = new SuspeitoService();

export default suspeitoService;