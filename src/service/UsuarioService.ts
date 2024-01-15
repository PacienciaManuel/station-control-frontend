import api from "./api";
import Usuario from "@/model/Funcionario";

class UsuarioService {
    private static URL = '/usuarios';
    
    updateProfilePhoto(idUsuario:number, formData: FormData){
        return api.patch<Usuario>(`${UsuarioService.URL}/fotoPerfil/${idUsuario}`, formData);
    };

    updateCoverPhoto(idUsuario:number, formData: FormData){
        return api.patch<Usuario>(`${UsuarioService.URL}/fotoCapa/${idUsuario}`, formData);
    };
}

const usuarioService = new UsuarioService();

export default usuarioService;