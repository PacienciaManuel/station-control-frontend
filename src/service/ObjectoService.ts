import PaginationResponse, { Direction, Pagination } from "@/model/Pagination";
import api from "./api";

class ObjectoService {
    private static URL = "/objectos";

    findAll(idOcorrencia: string) {
        return api.get<string>(`${ObjectoService.URL}/${idOcorrencia}`);
    }

    pagination({page, size, ocorrencia="", direction=Direction.ASC}: {ocorrencia?:string} & Pagination) {
        return api.get<PaginationResponse<string>>(`${ObjectoService.URL}/paginacao?page=${page}&size=${size}&ocorrencia=${ocorrencia}&direction=${direction}`);
    }

    create(idOcorrencia: string, objecto: string) {
        return api.post<string>(`${ObjectoService.URL}/${idOcorrencia}`, objecto);
    }

    createAll(idOcorrencia: string, objectos: string[]) {
        return api.post<string[]>(`${ObjectoService.URL}/lista/${idOcorrencia}`, objectos);
    }

    delete(idOcorrencia: string, objecto: string) {
        return api.delete<string>(`${ObjectoService.URL}/${idOcorrencia}`, {data: objecto});
    }
}

const objectoService = new ObjectoService();
export default objectoService;