import api from "./api";
import { NotificacaoDTO } from "@/model/Notificacao";
import NotificacaoFuncionario from "@/model/NotificacaoFuncionario";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class NotificacaoFuncionarioService {
    private static URL = '/notificacoes/funcionarios';
    
    findAll({funcionarioOrigem="", funcionarioDestino="", visto="" as "false", orderBy="dataNotificacao", direction=Direction.DESC}:{funcionarioOrigem?:String, funcionarioDestino?: string, visto?: "true" | "false"} & Sort){
        return api.get<NotificacaoFuncionario[]>(`${NotificacaoFuncionarioService.URL}?funcionarioOrigem=${funcionarioOrigem}&funcionarioDestino=${funcionarioDestino}&visto=${visto}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idNotificacao: string){
        return api.get<NotificacaoFuncionario>(`${NotificacaoFuncionarioService.URL}/${idNotificacao}`);
    };

    count({funcionarioOrigem="", funcionarioDestino="", visto="" as "false"}:{funcionarioOrigem?:String, funcionarioDestino?: string, visto?: "true" | "false"}){
        return api.get<number>(`${NotificacaoFuncionarioService.URL}/contador?funcionarioOrigem=${funcionarioOrigem}&funcionarioDestino=${funcionarioDestino}&visto=${visto}`);
    };

    pagination({page, size, funcionarioOrigem="", funcionarioDestino="", visto="" as "false", orderBy="dataNotificacao", direction=Direction.DESC}:{funcionarioOrigem?:String, funcionarioDestino?: string, visto?: "true" | "false"} & Pagination){
        return api.get<PaginationResponse<NotificacaoFuncionario>>(`${NotificacaoFuncionarioService.URL}/paginacao?page=${page}&size=${size}&funcionarioOrigem=${funcionarioOrigem}&funcionarioDestino=${funcionarioDestino}&visto=${visto}&orderBy=${orderBy}&direction=${direction}`);
    };

    create(idFuncionario: string, idFuncionarioDestino: string, notificacaoDTO:NotificacaoDTO){
        return api.post<NotificacaoFuncionario>(`${NotificacaoFuncionarioService.URL}/${idFuncionario}/${idFuncionarioDestino}`, notificacaoDTO);
    };

    update(idNotificacao: string, notificacaoDTO:NotificacaoDTO){
        return api.put<NotificacaoFuncionario>(`${NotificacaoFuncionarioService.URL}/${idNotificacao}`, notificacaoDTO);
    };

    deletey(idNotificacao: string){
        return api.delete<NotificacaoFuncionario>(`${NotificacaoFuncionarioService.URL}/${idNotificacao}`);
    };
}

const notificacaoFuncionarioService = new NotificacaoFuncionarioService();

export default notificacaoFuncionarioService;