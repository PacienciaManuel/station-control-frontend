"use client";

import Funcionario from "@/model/Funcionario";
import { useAppSelector } from "@/redux/hooks";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";

export default function useEmployeeURLProfile(funcionario: Funcionario):string {
    const funcionarioSessao = useAppSelector(selectFuncionario);
    return funcionarioSessao.id === funcionario.id ? "/perfile" : `/employees/${funcionario.id}`;
}
