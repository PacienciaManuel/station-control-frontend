import api from "./api";
import { STATUS } from '@/model/Status';
import { GENERO } from '@/model/Genero';
import SuspeitoOcorrencia, { SuspeitoOcorrenciaDTO } from './../model/SuspeitoOcorrencia';
import PaginationResponse, { Direction, Pagination, Sort } from '@/model/Pagination';

interface SuspeitoOcorrenciaQuery {
    ocorrencia?: string,
    statusOcorrencia?: STATUS,
    
    suspeito?: string,
    paisSuspeito?: string,
    nomeSuspeito?: string,
    generoSuspeito?: GENERO,
    detidoSuspeito?: "true" | "false",
    dataNascimentoSuspeito?: string,
    
    funcionario?: string,
    paisFuncionario?: string,
    nomeFuncionario?: string,
    emailFuncionario?: string,
    generoFuncionario?: GENERO,
    dataNascimentoFuncionario?: string,
}

class SuspeitoOcorrenciaService {
    private static URL = "/suspeitosOcorrencias";

    findAll({ocorrencia="", statusOcorrencia="" as STATUS.ANALISE, suspeito="", paisSuspeito="", nomeSuspeito="", generoSuspeito="" as GENERO.MASCULINO, detidoSuspeito="" as "false", dataNascimentoSuspeito="", funcionario="", nomeFuncionario="", generoFuncionario="" as GENERO.MASCULINO, emailFuncionario="", dataNascimentoFuncionario="", paisFuncionario="", orderBy="dataCriacao", direction=Direction.DESC}:SuspeitoOcorrenciaQuery & Sort){
        return api.get<SuspeitoOcorrencia[]>(`${SuspeitoOcorrenciaService.URL}?ocorrencia=${ocorrencia}&statusOcorrencia=${statusOcorrencia}&suspeito=${suspeito}&paisSuspeito=${paisSuspeito}&nomeSuspeito=${nomeSuspeito}&generoSuspeito=${generoSuspeito}&detidoSuspeito=${detidoSuspeito}&dataNascimentoSuspeito=${dataNascimentoSuspeito}&funcionario=${funcionario}&paisFuncionario=${paisFuncionario}&nomeFuncionario=${nomeFuncionario}&emailFuncionario=${emailFuncionario}&generoFuncionario=${generoFuncionario}&dataNascimentoFuncionario=${dataNascimentoFuncionario}&orderBy=${orderBy}&direction=${direction}`);
    }
    
    findById(idSuspeitoOcorrencia:string){
        return api.get<SuspeitoOcorrencia>(`${SuspeitoOcorrenciaService.URL}/${idSuspeitoOcorrencia}`);
    }
    
    count({ocorrencia="", statusOcorrencia="" as STATUS.ANALISE, suspeito="", paisSuspeito="", nomeSuspeito="", generoSuspeito="" as GENERO.MASCULINO, detidoSuspeito="" as "false", dataNascimentoSuspeito="", funcionario="", nomeFuncionario="", generoFuncionario="" as GENERO.MASCULINO, emailFuncionario="", dataNascimentoFuncionario="", paisFuncionario=""}:SuspeitoOcorrenciaQuery){
        return api.get<number>(`${SuspeitoOcorrenciaService.URL}contador?ocorrencia=${ocorrencia}&statusOcorrencia=${statusOcorrencia}&suspeito=${suspeito}&paisSuspeito=${paisSuspeito}&nomeSuspeito=${nomeSuspeito}&generoSuspeito=${generoSuspeito}&detidoSuspeito=${detidoSuspeito}&dataNascimentoSuspeito=${dataNascimentoSuspeito}&funcionario=${funcionario}&paisFuncionario=${paisFuncionario}&nomeFuncionario=${nomeFuncionario}&emailFuncionario=${emailFuncionario}&generoFuncionario=${generoFuncionario}&dataNascimentoFuncionario=${dataNascimentoFuncionario}`);
    }
    
    pagination({page, size, ocorrencia="", statusOcorrencia="" as STATUS.ANALISE, suspeito="", paisSuspeito="", nomeSuspeito="", generoSuspeito="" as GENERO.MASCULINO, detidoSuspeito="" as "false", dataNascimentoSuspeito="", funcionario="", nomeFuncionario="", generoFuncionario="" as GENERO.MASCULINO, emailFuncionario="", dataNascimentoFuncionario="", paisFuncionario="", orderBy="dataCriacao", direction=Direction.DESC}:SuspeitoOcorrenciaQuery & Pagination){
        return api.get<PaginationResponse<SuspeitoOcorrencia>>(`${SuspeitoOcorrenciaService.URL}/paginacao?page=${page}&size=${size}&ocorrencia=${ocorrencia}&statusOcorrencia=${statusOcorrencia}&suspeito=${suspeito}&paisSuspeito=${paisSuspeito}&nomeSuspeito=${nomeSuspeito}&generoSuspeito=${generoSuspeito}&detidoSuspeito=${detidoSuspeito}&dataNascimentoSuspeito=${dataNascimentoSuspeito}&funcionario=${funcionario}&paisFuncionario=${paisFuncionario}&nomeFuncionario=${nomeFuncionario}&emailFuncionario=${emailFuncionario}&generoFuncionario=${generoFuncionario}&dataNascimentoFuncionario=${dataNascimentoFuncionario}&orderBy=${orderBy}&direction=${direction}`);

    }

    create(idFuncionario: string, idOcorrencia: string, suspeitoOcorrenciaDTO: SuspeitoOcorrenciaDTO){
        return api.post<SuspeitoOcorrencia>(`${SuspeitoOcorrenciaService.URL}/${idFuncionario}/${idOcorrencia}`, suspeitoOcorrenciaDTO);
    }

    createAll(idFuncionario: string, idOcorrencia: string, suspeitosOcorrenciasDTO: SuspeitoOcorrenciaDTO[]) {
        return api.post<SuspeitoOcorrencia[]>(`${SuspeitoOcorrenciaService.URL}/lista/${idFuncionario}/${idOcorrencia}`, suspeitosOcorrenciasDTO);
    }

    delete(idSuspeitoOcorrencia:string){
        return api.delete<SuspeitoOcorrencia>(`${SuspeitoOcorrenciaService.URL}/${idSuspeitoOcorrencia}`)
    }
}

const suspeitoOcorrenciaService = new SuspeitoOcorrenciaService();
export default suspeitoOcorrenciaService;