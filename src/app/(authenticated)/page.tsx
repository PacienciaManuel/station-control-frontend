"use client";

import { Box } from "@mantine/core";
import { useQueries } from "react-query";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Grid from '@mui/material/Unstable_Grid2';
import Counter from '@/components/charts/Counter';
import { notifications } from "@mantine/notifications";
import suspeitoService from "@/service/SuspeitoService";
import { Divider, Stack, Typography } from "@mui/material";
import ocorrenciaService from "@/service/OcorrenciaService";
import requerenteService from "@/service/RequerenteService";
import funcionarioService from "@/service/FuncionarioService";
import Occurrences from "@/components/tables/Occurrences";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";
import EmployeeNotifications from "@/components/notification/EmployeeNotifications";
import notificacaoFuncionarioService from "@/service/NotificacaoFuncionarioService";
import ApplicantsNotifications from "@/components/notification/ApplicantsNotifications";
import notificacaoRequerenteService from "@/service/NotificacaoRequerenteService";
import crimeService from "@/service/CrimeService";
import { useId } from "react";
import { changeTotalApplicants, changeTotalCrimes, changeTotalEmployees, changeTotalOccurrences, changeTotalSuspects } from "@/redux/slicer/totalsSlicer";
import { AxiosResponse } from "axios";

export default function Home() {
    const dispatch = useAppDispatch();
    const funcionario = useAppSelector(selectFuncionario);
    const queries = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['totalEmployees'],
            queryFn: () =>  funcionarioService.count(),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalEmployees(data.data)),
            onError: (error: any) => notifications.show({title: 'Total de Funcionários', message: error.message || 'Não foi possível carregar o total de funcionários,', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['totalSuspects'],
            queryFn: () =>  suspeitoService.count({}),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalSuspects(data.data)),
            onError: (error: any) => notifications.show({title: 'Total de Suspeitos', message: error.message || 'Não foi possível carregar o total de suspeitos,', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['totalOcorrences'],
            queryFn: () =>  ocorrenciaService.count({}),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalOccurrences(data.data)),
            onError: (error: any) => notifications.show({title: 'Total de Ocorrências', message: error.message || 'Não foi possível carregar o total de ocorrências,', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['totalRequerentes'],
            queryFn: () =>  requerenteService.count({}),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalApplicants(data.data)),
            onError: (error: any) => notifications.show({title: 'Total de Requerentes', message: error.message || 'Não foi possível carregar o total de requerentes,', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['totalCrimes'],
            queryFn: () =>  crimeService.count({}),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalCrimes(data.data)),
            onError: (error: any) => notifications.show({title: 'Total de Crimes', message: error.message || 'Não foi possível carregar o total de crimes,', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['notificationsForMe'],
            queryFn: () =>  notificacaoFuncionarioService.pagination({page: 0, size: 5, funcionarioDestino: funcionario.id}),
            onError: (error: any) => notifications.show({title: 'Minhas Notificações', message: error.message || 'Não foi possível carregar as tuas notificações.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ['applicantsNotifications'],
            queryFn: () =>  notificacaoRequerenteService.pagination({page: 0, size: 5}),
            onError: (error: any) => notifications.show({title: 'Notificações do Requerentes', message: error.message || 'Não foi possível carregar as notificações dos requerentes.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.pagination({page: 0, size: 50}),
            onError: (error: any) => notifications.show({title: 'Ocorrências', message: error.message || 'Não foi possível carregar as Ocorrências.', color: 'red'}),
        },
    ]);

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Dashboard</Typography>
                <Divider orientation="horizontal"/>
            </Box>
            <Grid spacing={3} container>
                <Grid xs={12} md={6} lg={4}>
                    <Counter label="Funcionários" loading={queries[0].isLoading} counter={queries[0].data?.data || 0} urlList="/employees" urlNew="/employees/new" color="primary"/>
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <Counter label="Suspeitos" loading={queries[1].isLoading} counter={queries[1].data?.data || 0}  urlList="/suspects" urlNew="/suspects/new" color="info"/>
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <Counter label="Ocorrências" loading={queries[2].isLoading} counter={queries[2].data?.data || 0}  urlList="/occurrences" urlNew="/occurrences/new" color="secondary"/>
                </Grid>
                <Grid xs={12} md={6} lg={6}>
                    <Counter label="Requerentes" loading={queries[3].isLoading} counter={queries[3].data?.data || 0}  urlList="/applicants" urlNew="/applicants/new" color="info"/>
                </Grid>
                <Grid xs={12} md={6} lg={6}>
                    <Counter label="Crimes" loading={queries[4].isLoading} counter={queries[4].data?.data || 0}  urlList="/crimes" urlNew="/crimes/new" color="info"/>
                </Grid>
            </Grid>
            <Grid spacing={3} container>
                <Grid xs={12} md={6}>
                    <EmployeeNotifications loading={queries[5].isLoading} total={queries[5].data?.data.totalElements} notifications={queries[5].data?.data.content} />
                </Grid>
                <Grid xs={12} md={6}>
                    <ApplicantsNotifications loading={queries[6].isLoading} total={queries[6].data?.data.totalElements} notifications={queries[6].data?.data.content} />
                </Grid>
            </Grid>
            <Grid spacing={3} container>
                <Grid xs={12}>
                    <Occurrences title="Ocorrências" total={queries[7].data?.data.totalElements} ocorrencias={queries[7].data?.data.content}/>
                </Grid>
            </Grid>
        </Stack>

    )
}
