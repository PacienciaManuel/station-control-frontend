import api from "./api";
import Crime, { CrimeDTO } from "@/model/Crime";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";


class CrimeService {
    private static URL = '/crimes';
    
    findAll({descricao="", funcionario="", orderBy="descricao", direction=Direction.ASC}:{funcionario?:string, descricao?: string;} & Sort) {
        return api.get<Crime[]>(`${CrimeService.URL}?funcionario=${funcionario}&descricao=${descricao}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idCrime: string) {
        return api.get<Crime>(`${CrimeService.URL}/${idCrime}`);
    };

    findAllByOcorrencia(idOcorrencia: string) {
        return api.get<Crime[]>(`${CrimeService.URL}/ocorrencia/${idOcorrencia}`);
    };
    
    count({funcionario=""}:{funcionario?:string}) {
        return api.get<number>(`${CrimeService.URL}/contador?funcionario=${funcionario}`);
    };
    
    pagination({page, size, funcionario="", ocorrencia="", nome="", vigor="" as "false", orderBy="nome", direction=Direction.ASC}:{funcionario?:string,nome?: string, vigor?: "true" | "false", ocorrencia?:string} & Pagination) {
        return api.get<PaginationResponse<Crime>>(`${CrimeService.URL}/paginacao?page=${page}&size=${size}&funcionario=${funcionario}&ocorrencia=${ocorrencia}&nome=${nome}&vigor=${vigor}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(idFuncionario: string, crimeDTO: CrimeDTO) {
        return api.post<Crime>(`${CrimeService.URL}/${idFuncionario}`, crimeDTO);
    };
    
    createAll(idFuncionario: string, crimesDTO: CrimeDTO[]) {
        return api.post<Crime[]>(`${CrimeService.URL}/${idFuncionario}/lista`, crimesDTO);
    };
    
    createByOcorrencia(idOcorrencia: string, idCrime: string) {
        return api.post<Crime>(`${CrimeService.URL}/ocorrencia/${idOcorrencia}/${idCrime}`);
    };
    
    createAllByOcorrencia(idOcorrencia: string, idsCrimes: string[]) {
        return api.post<Crime>(`${CrimeService.URL}/ocorrencia/${idOcorrencia}`, idsCrimes);
    };
    
    update(idCrime: string, crimeDTO: CrimeDTO) {
        return api.put<Crime>(`${CrimeService.URL}/${idCrime}`, crimeDTO);
    };
    
    delete(idCrime: string) {
        return api.delete<Crime>(`${CrimeService.URL}/${idCrime}`);
    };
    
    deleteByOcorrencia(idOcorrencia: string, idCrime: string) {
        return api.delete<Crime>(`${CrimeService.URL}/ocorrencia/${idOcorrencia}/${idCrime}`);
    };
}

const crimeService = new CrimeService();
export default crimeService;