import api from "./api";
import { GENERO } from "@/model/Genero";
import Requerente, { RequerenteDTO } from "@/model/Requerente";
import { TelefoneDTO } from "@/model/Telefone";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class RequerenteService {
    private static URL = '/requerentes';
    
    findAll({funcionario="", nome="", genero="" as GENERO, dataNascimento="", morada="", pais="", orderBy="nome", direction=Direction.ASC}:{funcionario?:String, nome?: string, genero?: GENERO, dataNascimento?: string, morada?: string, pais?: string} & Sort) {
        return api.get<Requerente[]>(`${RequerenteService.URL}?nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&morada=${morada}&pais=${pais}&funcionario=${funcionario}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idRequerente: string) {
        return api.get<Requerente>(`${RequerenteService.URL}/${idRequerente}`);
    };

    count({funcionario="", genero="" as GENERO, orderBy="nome", direction=Direction.ASC}:{funcionario?: string, genero?: GENERO} & Sort){
        return api.get<number>(`${RequerenteService.URL}/contador?genero=${genero}&funcionario=${funcionario}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    pagination({page, size, funcionario="", nome="", genero="" as GENERO, dataNascimento="", morada="", pais="", orderBy="nome", direction=Direction.ASC}:{funcionario?: string, nome?: string, genero?: GENERO, dataNascimento?: string, morada?: string, pais?: string} & Pagination) {
        return api.get<PaginationResponse<Requerente>>(`${RequerenteService.URL}/paginacao?page=${page}&size=${size}&funcionario=${funcionario}&nome=${nome}&genero=${genero}&dataNascimento=${dataNascimento}&morada=${morada}&pais=${pais}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(idFuncionario: string, idPais: string, requerente: RequerenteDTO & TelefoneDTO){
        return api.post<Requerente>(`${RequerenteService.URL}/${idFuncionario}/${idPais}`, requerente);
    };
    
    update(idRequerente: string, idPais: string, requerente: RequerenteDTO) {
        return api.put<Requerente>(`${RequerenteService.URL}/${idRequerente}/${idPais}`, requerente);
    };
    
    delete(idRequerente: string) {
        return api.delete<Requerente>(`${RequerenteService.URL}/${idRequerente}`);
    };
}

const requerenteService = new RequerenteService();

export default requerenteService;