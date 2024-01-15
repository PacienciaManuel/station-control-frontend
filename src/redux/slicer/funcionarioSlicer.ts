import Genero from '@/model/Genero';
import Telefone from '@/model/Telefone';
import type { RootState } from '../store';
import Funcionario from '@/model/Funcionario';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const funcionarioSlice = createSlice({
    name: 'funcionario',
    initialState: {} as Funcionario,
    reducers: {
        changeFuncionario: (state, { payload }: PayloadAction<Funcionario>) => {
            return payload;
        },

        changeGender: (state, { payload }: PayloadAction<Genero>) => {
            return {...state, genero: payload};
        },

        changeBirthDate: (state, { payload }: PayloadAction<string>) => {
            return {...state, dataNascimento: payload};
        },

        changeEmail: (state, { payload }: PayloadAction<string>) => {
            return {...state, email: payload};
        },

        changeMorada: (state, { payload }: PayloadAction<string>) => {
            return {...state, morada: payload};
        },

        changeBiografia: (state, { payload }: PayloadAction<string>) => {
            return {...state, notaInformativa: payload};
        },

        changeProfilePhoto: (state, { payload }: PayloadAction<string>) => {
            return {...state, fotoPerfil: payload};
        },

        changePhone: (state, { payload }: PayloadAction<Telefone>) => {
            return {...state, telefone: payload};
        },

    }
})

export const { 
    changeFuncionario, changeGender, 
    changeBirthDate, changeEmail, changeMorada, 
    changeBiografia, changeProfilePhoto, changePhone,
} = funcionarioSlice.actions;
export const selectFuncionario = (state: RootState) => state.funcionario;
export default funcionarioSlice.reducer