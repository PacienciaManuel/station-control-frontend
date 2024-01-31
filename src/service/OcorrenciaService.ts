import api from "./api";
import { STATUS } from "@/model/Status";
import Ocorrencia, { OcorrenciaDTO } from "@/model/Ocorrencia";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class OcorrenciaService {
    private static URL = '/ocorrencias';
    
    findAll({funcionario="", requerente="", status="" as STATUS, orderBy="dataAtualizacao", direction=Direction.DESC}:{funcionario?:String, requerente?: string, status?: STATUS} & Sort){
        return api.get<Ocorrencia[]>(`${OcorrenciaService.URL}?&funcionario=${funcionario}&requerente=${requerente}&status=${status}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idOcorrencia: string){
        return api.get<Ocorrencia>(`${OcorrenciaService.URL}/${idOcorrencia}`);
    };
    
    count({funcionario="", requerente="", status="" as STATUS}:{funcionario?:String, requerente?: string, status?: STATUS}){
        return api.get<number>(`${OcorrenciaService.URL}/contador?funcionario=${funcionario}&requerente=${requerente}&status=${status}`);
    };
    
    countByCreationDateBetween({funcionario="", dataInicio, dataFim }:{funcionario?:string, dataInicio:string, dataFim: string}){
        return api.get<number>(`${OcorrenciaService.URL}/contador/dataCricao?funcionario=${funcionario}&dataInicio=${dataInicio}&dataFim=${dataFim}`);
    };
    
    countByOccurrenceDateBetween({funcionario="", dataInicio, dataFim }:{funcionario?:string, dataInicio:string, dataFim: string}){
        return api.get<number>(`${OcorrenciaService.URL}/contador/dataOcorrencia?funcionario=${funcionario}&dataInicio=${dataInicio}&dataFim=${dataFim}`);
    };
    
    pagination({page, size, funcionario="", requerente="", status="" as STATUS, orderBy="dataAtualizacao", direction=Direction.DESC}:{funcionario?:String, requerente?: string, status?: STATUS} & Pagination){
        return api.get<PaginationResponse<Ocorrencia>>(`${OcorrenciaService.URL}/paginacao?page=${page}&size=${size}&funcionario=${funcionario}&requerente=${requerente}&status=${status}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    paginationByCreateDateBetween({ funcionario="", page, size, dataInicio, dataFim, orderBy="dataAtualizacao", direction=Direction.DESC }:{funcionario?:string, dataInicio:string, dataFim: string} & Pagination){
        return api.get<PaginationResponse<Ocorrencia>>(`${OcorrenciaService.URL}/paginacao/dataCricao?page=${page}&size=${size}&funcionario=${funcionario}&dataInicio=${dataInicio}&dataFim=${dataFim}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    paginationByOccurrenceDateBetween({ funcionario="", page, size, dataInicio, dataFim, orderBy="dataAtualizacao", direction=Direction.DESC }:{funcionario?:string, dataInicio:string, dataFim: string} & Pagination){
        return api.get<PaginationResponse<Ocorrencia>>(`${OcorrenciaService.URL}/paginacao/dataOcorrencia?page=${page}&size=${size}&funcionario=${funcionario}&dataInicio=${dataInicio}&dataFim=${dataFim}&orderBy=${orderBy}&direction=${direction}`);
    };

    create(idFuncionario: string, idRequerente: string, ocorrenciaDTO: OcorrenciaDTO) {
        return api.post<Ocorrencia>(`${OcorrenciaService.URL}/${idFuncionario}/${idRequerente}`, ocorrenciaDTO);
    }

    update(idOcorrencia: string, idRequerente: string, ocorrenciaDTO: OcorrenciaDTO) {
        return api.put<Ocorrencia>(`${OcorrenciaService.URL}/${idOcorrencia}/${idRequerente}`, ocorrenciaDTO);
    }

    delete(idOcorrencia: string) {
        return api.delete<Ocorrencia>(`${OcorrenciaService.URL}/${idOcorrencia}`)
    }
}

const ocorrenciaService = new OcorrenciaService();
export default ocorrenciaService;