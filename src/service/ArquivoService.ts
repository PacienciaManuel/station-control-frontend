import api from "./api";
import Arquivo from "@/model/Arquivo";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";

class ArquivoService {
    private static URL = '/arquivos';
        
    findAll({ ocorrencia="", orderBy="dataArquivo", direction=Direction.DESC }:{ocorrencia?: string} & Sort) {
        return api.get<Arquivo[]>(`${ArquivoService.URL}?ocorrencia=${ocorrencia}&orderBy=${orderBy}&direction=${direction}`);
    };
        
    count({ ocorrencia="" }:{ocorrencia?: string}) {
        return api.get<number>(`${ArquivoService.URL}contador?ocorrencia=${ocorrencia}`);
    };
        
    pagination({ page, size, ocorrencia="", orderBy="dataArquivo", direction=Direction.DESC }:{ocorrencia?: string} & Pagination){
        return api.get<PaginationResponse<Arquivo>>(`${ArquivoService.URL}/paginacao?page=${page}&size=${size}&ocorrencia=${ocorrencia}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(idOcorrencia: string, formData: FormData) {
        return api.post<Arquivo>(`${ArquivoService.URL}/${idOcorrencia}`, formData);
    };

    createAll(idOcorrencia: string, formData: FormData) {
        return api.post<Arquivo[]>(`${ArquivoService.URL}/lista/${idOcorrencia}`, formData);
    };
    
    delete(idOcorrencia: string) {
        return api.delete<Arquivo>(`${ArquivoService.URL}/${idOcorrencia}`);
    };
}

const arquivoService = new ArquivoService();

export default arquivoService;