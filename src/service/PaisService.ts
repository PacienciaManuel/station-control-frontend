import api from "./api";
import Pais from "@/model/Pais";
import PaginationResponse, { Direction, Pagination, Sort } from "@/model/Pagination";


class PaisService {
    private static URL = '/paises';
    
    findAll({nome="", orderBy="nome", direction=Direction.ASC}:{nome?: string;} & Sort) {
        return api.get<Pais[]>(`${PaisService.URL}?nome=${nome}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    findById(idPais: string) {
        return api.get<Pais>(`${PaisService.URL}/${idPais}`);
    };
    
    pagination({page, size, nome="", orderBy="nome", direction=Direction.ASC}:{nome?: string;} & Pagination) {
        return api.get<PaginationResponse<Pais>>(`${PaisService.URL}/paginacao?page=${page}&size=${size}&nome=${nome}&orderBy=${orderBy}&direction=${direction}`);
    };
    
    create(pais: Pais) {
        return api.post<Pais>(`${PaisService.URL}`, pais);
    };
    
    createAll(paises: Pais[]) {
        return api.post<Pais[]>(`${PaisService.URL}/lista`, paises);
    };
    
    update(idPais: string, pais: Pais) {
        return api.put<Pais>(`${PaisService.URL}`);
    };
    
    delete(idPais: string) {
        return api.delete<Pais>(`${PaisService.URL}/${idPais}`);
    };
}

const paisService = new PaisService();

export default paisService;