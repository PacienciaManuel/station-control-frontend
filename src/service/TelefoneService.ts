import api from "./api";
import Telefone, { TelefoneDTO } from "@/model/Telefone";

class TelefoneService {
    private static URL = '/telefones';
        
    findAllByFuncionario(idFuncionario: string) {
        return api.get<Telefone[]>(`${TelefoneService.URL}/funcionarios/${idFuncionario}`);
    };
    
    findByRequerente(idRequerente: string){
        return api.get<Telefone>(`${TelefoneService.URL}/requerentes/${idRequerente}`);
    };
    
    count(){
        return api.get<number>(`${TelefoneService.URL}/contador`);
    };
    
    createByFuncionario(idFuncionario:string, telefoneDTO: TelefoneDTO){
        return api.post<Telefone>(`${TelefoneService.URL}/funcionarios/${idFuncionario}`, telefoneDTO);
    };
    
    deleteByFuncionario(idFuncionario:string, idTelefone:string,){
        return api.delete<Telefone>(`${TelefoneService.URL}/funcionarios/${idFuncionario}/${idTelefone}`);
    };
}

const telefoneService = new TelefoneService();
export default telefoneService;