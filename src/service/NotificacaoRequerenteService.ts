import api from "./api";
import { NotificacaoDTO } from "@/model/Notificacao";
import NotificacaoRequerente from "@/model/NotificacaoRequerente";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class NotificacaoRequerenteService {
    private static URL = '/notificacoes/requerentes';
    
    findAll({funcionario="", requerente="", recebido="" as "false", orderBy="dataNotificacao", direction=Direction.DESC}:{funcionario?:String, requerente?: string, recebido?: "true" | "false"} & Sort){
        return api.get<NotificacaoRequerente[]>(`${NotificacaoRequerenteService.URL}?funcionario=${funcionario}&requerente=${requerente}&recebido=${recebido}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idNotificacao: string){
        return api.get<NotificacaoRequerente>(`${NotificacaoRequerenteService.URL}/${idNotificacao}`);
    };

    count({funcionario="", requerente="", recebido="" as "false"}:{funcionario?:String, requerente?: string, recebido?: "true" | "false"}){
        return api.get<NotificacaoRequerente[]>(`${NotificacaoRequerenteService.URL}/contador?funcionario=${funcionario}&requerente=${requerente}&recebido=${recebido}`);
    };

    pagination({page, size, funcionario="", requerente="", recebido="" as "false", orderBy="dataNotificacao", direction=Direction.DESC}:{funcionario?:String, requerente?: string, recebido?: "true" | "false"} & Pagination){
        return api.get<PaginationResponse<NotificacaoRequerente>>(`${NotificacaoRequerenteService.URL}/paginacao?page=${page}&size=${size}&funcionario=${funcionario}&requerente=${requerente}&recebido=${recebido}&orderBy=${orderBy}&direction=${direction}`);
    };

    create(idFuncionario: string, idRequerente: string, notificacaoDTO:NotificacaoDTO){
        return api.post<NotificacaoRequerente>(`${NotificacaoRequerenteService.URL}/${idFuncionario}/${idRequerente}`, notificacaoDTO);
    };

    update(idNotificacao: string, notificacaoDTO:NotificacaoDTO){
        return api.put<NotificacaoRequerente>(`${NotificacaoRequerenteService.URL}/${idNotificacao}`, notificacaoDTO);
    };

    deletey(idNotificacao: string){
        return api.delete<NotificacaoRequerente>(`${NotificacaoRequerenteService.URL}/${idNotificacao}`);
    };
}

const notificacaoRequerenteService = new NotificacaoRequerenteService();

export default notificacaoRequerenteService;