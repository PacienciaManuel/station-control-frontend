"use client";

import "dayjs/locale/pt-br"
import { CrimeDTO } from "@/model/Crime";
import { useCallback, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import crimeService from "@/service/CrimeService";
import FormCrime from "@/components/form/FormCrime";
import useErrorHandler from "@/hooks/useErrorHandler";
import { notifications } from "@mantine/notifications";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";

export default function NewCrimePage() {
    const errorHandler = useErrorHandler("Novo Crime");
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    const handleCreate = useCallback((crimeDTO: CrimeDTO, reset: () => void) => {
        setLoading(true);
        crimeService.create(funcionario.id, crimeDTO).then((response) => {
            reset();
            notifications.show({title: "Novo Crime", message: `O crime \"${response.data.nome}\" foi criado com sucesso.`, color: "green"});
        }).catch(errorHandler).finally(() =>setLoading(false));
        console.log("DATA: ", crimeDTO);
    },[setLoading, errorHandler, funcionario.id])
    
    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Novo Crime</Typography>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <FormCrime loading={loading} handleCreate={handleCreate}/>
        </Stack>
    )
}
