"use client";

import React, { useCallback, useId, useState } from 'react';
import { Chip, Text, rem } from '@mantine/core';
import { useQueries } from 'react-query';
import { useAppSelector } from '@/redux/hooks';
import { Direction } from '@/model/Pagination';
import Grid from '@mui/material/Unstable_Grid2';
import { IconNotification, IconTrash, IconUserEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import resourceResolver from '@/util/ResourceResolver';
import suspeitoService from '@/service/SuspeitoService';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import Occurrences from '@/components/tables/Occurrences';
import ocorrenciaService from '@/service/OcorrenciaService';
import requerenteService from '@/service/RequerenteService';
import { selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import EmployeeDetails from '@/components/employee-details/EmployeeDetails';
import notificacaoFuncionarioService from '@/service/NotificacaoFuncionarioService';
import EmployeeNotifications from '@/components/notification/EmployeeNotifications';
import { Avatar, Box, Button, Divider, Paper, Stack, Tab, Typography } from '@mui/material';
import Applicants from '@/components/tables/Applicants';
import Suspects from '@/components/tables/Suspects';
import Counter from '@/components/charts/Counter';
import funcionarioService from '@/service/FuncionarioService';
import { selectTatals } from '@/redux/slicer/totalsSlicer';
import Papel from '@/model/Papel';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import { IconShieldLock } from '@tabler/icons-react';
import NewEmployeeNotificationDialog from '@/components/notification/NewEmployeeNotificationDialog';

interface EmployeeProfileProps {
    params: {
        id: string,
    }
}

const iconStyle = {width: rem(19), height: rem(19)};

export default function EmployeeProfile({params}:EmployeeProfileProps) {
    const now = new Date();
    const router = useRouter();
    const defaultPanelId = useId();
    const suspectPanelId = useId();
    const applicantPanelId = useId();
    const occurrencePanelId = useId();
    const totals = useAppSelector(selectTatals);
    const funcionarioSessao = useAppSelector(selectFuncionario);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [tabContext, setTabContext] = useState<string>(defaultPanelId);
    const [openNewNotificationDialog, setOpenNewNotificationDialog] = useState<boolean>(false)
    const queries = useQueries([
        {
            queryKey: [useId()],
            queryFn: () =>  funcionarioService.findById(params.id),
            onError: (error: any) => notifications.show({title: 'Funcionário', message: error.message || 'Não foi possível carregar os dados do funcionário.', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.count({funcionario: params.id}),
            onError: (error: any) => notifications.show({title: 'Total de Ocorrências', message: error.message || 'Não foi possível carregar o total de ocorrências,', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  requerenteService.count({funcionario: params.id}),
            onError: (error: any) => notifications.show({title: 'Total de Requerentes', message: error.message || 'Não foi possível carregar o total de requerentes,', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  suspeitoService.count({funcionario: params.id}),
            onError: (error: any) => notifications.show({title: 'Total de Suspeitos', message: error.message || 'Não foi possível carregar o total de suspeitos,', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  notificacaoFuncionarioService.pagination({page: 0, size: 5, funcionarioOrigem: funcionarioSessao.id, funcionarioDestino: params.id}),
            onError: (error: any) => notifications.show({title: 'Minhas Notificações', message: error.message || 'Não foi possível carregar as tuas notificações.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.findAll({funcionario: params.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Ocorrências', message: error.message || 'Não foi possível carregar as Ocorrências.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  requerenteService.findAll({funcionario: params.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Requerentes', message: error.message || 'Não foi possível carregar as requerentes.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["suspects-by-employee"],
            queryFn: () =>  suspeitoService.findAll({funcionario: params.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar as suspeitos.', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.countByCreationDateBetween({funcionario: params.id, dataInicio: new Date(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0).toISOString().replace("Z", ""), dataFim: new Date(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59).toISOString().replace("Z", ""),}),
            onError: (error: any) => notifications.show({title: 'Ocorrências de Hoje', message: error.message || 'Não foi possível carregar o total de ocorrências de hoje.', color: 'red'}),
        },
    ]);

    const handleChangeTabContext = (event: React.SyntheticEvent, newValue: string) => {
        setTabContext(newValue);
    };

    const handleDelete = useCallback(() => {
        setLoadingDelete(true);
        funcionarioService.delete(params.id).then((response) => {
            const data = response.data;
            notifications.show({title: 'Funcionários', message: `Funcionário ${data.nome} excluido com sucesso!!!`, color: 'green'});
            router.replace("/employees");
        }).catch((error) => {
            console.log("ERROR: ", error);
            notifications.show({title: 'Exclusão de Funcionário', message: error?.response?.data?.message || `Não foi possível excluir o/a funcionário/a ${queries[0].data?.data.nome}.`, color: 'red'});
        }).finally(function() {
            setLoadingDelete(false);
        });
    }, [params.id, queries, router]);

    const onDelete = useCallback((evt:React.MouseEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        modals.openConfirmModal({
            title: 'Exclusão de Funcionário',
            children: (
                <Typography variant="body2" sx={{color: "#000"}}>
                    <Text style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit"}}>
                        Deseja excluir os dados do/a funcionário/a <b>{queries[0].data?.data.nome}</b>?.
                    </Text>
                </Typography>
            ),
            labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
            onConfirm: handleDelete,
            onCancel: () => notifications.show({title: 'Exclusão de Funcionário', message: "Operação cancelada com sucesso.", color: "blue"}),
        });
    }, [handleDelete, queries]);
    
    return (
        <>
            <Stack sx={{gap: 3}}>
                <Box>
                    <Typography variant="h2">Perfil</Typography>
                    <Divider orientation="horizontal"/>
                </Box>
                <TabContext value={tabContext}>
                    <Stack spacing={2} elevation={0} component={Paper} sx={{px: 2, pt: 2}}>
                        <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "flex-start"}}>
                            <Stack spacing={2} direction="row" sx={{alignItems: "center"}}>
                                <Avatar sx={{width: 128, height: 128}} alt="Foto Perfil" src={resourceResolver.profilePhoto(queries[0].data?.data.fotoPerfil)}/>
                                <Box>
                                    <Typography variant="h4" sx={{fontWeight: 700}}>{queries[0].data?.data.nome}</Typography>
                                    <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={queries[0].data?.data.papel === Papel.ADMINISTRADOR ? "orange" : "green"} variant="light" size="xs" checked>{queries[0].data?.data.papel}</Chip>
                                </Box>
                            </Stack>
                            <Stack direction="row" sx={{flexWrap: "wrap", gap: 2}}>
                                <Button onClick={()=> setOpenNewNotificationDialog(true)} disabled={loadingDelete} color="primary" disableElevation variant="contained" startIcon={<IconNotification style={iconStyle}/>} sx={{color: "#fff"}}>Notificar</Button>
                                {funcionarioSessao.papel === Papel.ADMINISTRADOR && (<>
                                    <LoadingButton onClick={onDelete} loading={loadingDelete} color="error" disableElevation variant="contained" startIcon={<IconTrash style={iconStyle}/>}>Excluir</LoadingButton>
                                </>)}
                            </Stack>
                        </Stack>
                        <TabList onChange={handleChangeTabContext} aria-label="lab API tabs example">
                            <Tab label="Perfil" value={defaultPanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Ocorrências" value={occurrencePanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Requerentes" value={applicantPanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Suspeitos" value={suspectPanelId} sx={{color: theme => theme.palette.background.default}}/>
                        </TabList>
                    </Stack>
                    <TabPanel value={defaultPanelId} sx={{p: 0}}>
                        <Grid spacing={3} container>
                            <Grid xs={12} md={4}>
                                <EmployeeDetails funcionario={queries[0].data?.data} totalOcorrencias={queries[1].data?.data} totalRequerentes={queries[2].data?.data} totalSuspeitos={queries[3].data?.data}/>
                            </Grid>
                            <Grid xs={12} md={8}>
                                <EmployeeNotifications loading={queries[4].isLoading} total={queries[4].data?.data.totalElements} notifications={queries[4].data?.data.content} />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={occurrencePanelId} sx={{p: 0}}>
                        <Stack gap={2}>
                            <Grid spacing={3} container>
                                <Grid xs={12} md={6}>
                                    <Counter label="Todal Ocorrências" loading={queries[1].isLoading} counter={queries[1].data?.data || 0} urlList="/occurrences" urlNew="/occurrences/new" color="primary"/>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Counter label="Ocorrências Hoje" loading={queries[8].isLoading} counter={queries[8].data?.data || 0}  urlList="/occurrences" urlNew="/occurrences/new" color="info"/>
                                </Grid>
                            </Grid>
                            <Occurrences title="Minhas Ocorrências" ocorrencias={queries[5].data?.data} total={totals.totalOccurrences}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={applicantPanelId} sx={{p: 0}}>
                        <Stack spacing={2}>
                            <Counter label="Requerentes" loading={queries[2].isLoading} counter={queries[2].data?.data || 0}  urlList="/applicants" urlNew="/applicants/new" color="info"/>
                            <Applicants title="Meus Cadastros de Requerentes" requerentes={queries[6].data?.data} total={totals.totalApplicants}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={suspectPanelId} sx={{p: 0}}>
                        <Stack spacing={2}>
                            <Counter label="Suspeitos" loading={queries[3].isLoading} counter={queries[3].data?.data || 0}  urlList="/suspects" urlNew="/suspects/new" color="info"/>
                            <Suspects title="Meus Cadastros de Suspeitos" suspeitos={queries[7].data?.data} total={totals.totalSuspects}/>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Stack>
            <NewEmployeeNotificationDialog open={openNewNotificationDialog} funcionarioOrigem={funcionarioSessao} funcionarioDestino={queries[0].data?.data} handleClose={()=> setOpenNewNotificationDialog(false)} handleRefresh={() => queries[4].refetch()}/>
        </>
    )
}
