"use client";

import "dayjs/locale/pt-br"
import { useQuery } from "react-query";
import { CrimeDTO } from "@/model/Crime";
import { useCallback, useState } from "react";
import crimeService from "@/service/CrimeService";
import FormCrime from "@/components/form/FormCrime";
import useErrorHandler from "@/hooks/useErrorHandler";
import { notifications } from "@mantine/notifications";
import { Box, Divider, Stack, Typography } from "@mui/material";

interface UpdateCrimePageProps {
    params: {
        id: string;
    }
}

export default function UpdateCrimePage({params}:UpdateCrimePageProps) {
    const errorHandler = useErrorHandler("Alterar Crime");
    const [loading, setLoading] = useState<boolean>(false);
    const query = useQuery({
        enabled: true,
        // refetchOnMount: false,
        refetchInterval: false,
        // refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        queryKey: [params.id],
        queryFn: () =>  crimeService.findById(params.id),
        onError: (error: any) => errorHandler(error),
    });

    const handleUpdate = useCallback((idCrime:string, crimeDTO: CrimeDTO, reset: () => void) => {
        setLoading(true);
        crimeService.update(idCrime, crimeDTO).then((response) => {
            reset();
            notifications.show({title: "Alterar Crime", message: `O crime \"${response.data.nome}\" foi alterado com sucesso.`, color: "green"});
        }).catch(errorHandler).finally(() =>setLoading(false));
        console.log("DATA: ", crimeDTO);
    },[setLoading, errorHandler])
    
    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Alterar Crime</Typography>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <FormCrime crime={query.data?.data} loading={loading} handleUpdate={handleUpdate}/>
        </Stack>
    )
}
