"use client";

import Link from 'next/link';
import React, { useId, useState } from 'react';
import { Chip, rem } from '@mantine/core';
import { useQueries } from 'react-query';
import { useAppSelector } from '@/redux/hooks';
import { Direction } from '@/model/Pagination';
import Grid from '@mui/material/Unstable_Grid2';
import { IconPhone, IconSettings, IconShieldLock, IconUserEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import resourceResolver from '@/util/ResourceResolver';
import suspeitoService from '@/service/SuspeitoService';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Occurrences from '@/components/tables/Occurrences';
import ocorrenciaService from '@/service/OcorrenciaService';
import requerenteService from '@/service/RequerenteService';
import { selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import EmployeeDetails from '@/components/employee-details/EmployeeDetails';
import notificacaoFuncionarioService from '@/service/NotificacaoFuncionarioService';
import EmployeeNotifications from '@/components/notification/EmployeeNotifications';
import { Avatar, Box, Button, Divider, IconButton, Paper, Stack, Tab, Typography, alpha } from '@mui/material';
import Applicants from '@/components/tables/Applicants';
import Suspects from '@/components/tables/Suspects';
import UpdateProfilePhotoDialog from '../../../components/dialog/UpdateProfilePhotoDialog';
import UpdateProfileDialog from '../../../components/dialog/UpdateProfileDialog';
import Counter from '@/components/charts/Counter';
import Papel from '@/model/Papel';
import PhoneDialog from '@/components/dialog/phone/PhoneDialog';

const iconStyle = {width: rem(19), height: rem(19)};

export default function ProfilePage() {
    const now = new Date();
    const defaultPanelId = useId();
    const suspectPanelId = useId();
    const applicantPanelId = useId();
    const occurrencePanelId = useId();
    const funcionario = useAppSelector(selectFuncionario);
    const [tabContext, setTabContext] = useState<string>(defaultPanelId);
    const [openPhoneDialog, setOpenPhoneDialog] = useState<boolean>(false)
    const [openUpdateProfileDialog, setOpenUpdateProfileDialog] = useState<boolean>(false)
    const [openUpdateProfilePhotoDialog, setOpenUpdateProfilePhotoDialog] = useState<boolean>(false)
    const queries = useQueries([
        {
            queryKey: [useId()],
            queryFn: () =>  suspeitoService.count({funcionario: funcionario.id}),
            onError: (error: any) => notifications.show({title: 'Total de Suspeitos', message: error.message || 'Não foi possível carregar o total de suspeitos,', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  requerenteService.count({funcionario: funcionario.id}),
            onError: (error: any) => notifications.show({title: 'Total de Requerentes', message: error.message || 'Não foi possível carregar o total de requerentes,', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.count({funcionario: funcionario.id}),
            onError: (error: any) => notifications.show({title: 'Total de Ocorrências', message: error.message || 'Não foi possível carregar o total de ocorrências,', color: 'red'}),
        },
        {
            queryKey: [useId()],
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
            queryKey: ["occorrence-by-employee"],
            queryFn: () =>  ocorrenciaService.findAll({funcionario: funcionario.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Ocorrências', message: error.message || 'Não foi possível carregar as Ocorrências.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["count-all-occorrence"],
            queryFn: () =>  ocorrenciaService.count({}),
            onError: (error: any) => notifications.show({title: 'Ocorrências', message: error.message || 'Não foi possível carregar o total de Ocorrências.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["applicants-by-employee"],
            queryFn: () =>  requerenteService.findAll({funcionario: funcionario.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Requerentes', message: error.message || 'Não foi possível carregar as requerentes.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["count-all-applicants"],
            queryFn: () =>  requerenteService.count({}),
            onError: (error: any) => notifications.show({title: 'Requerentes', message: error.message || 'Não foi possível carregar o total de requerentes.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["suspects-by-employee"],
            queryFn: () =>  suspeitoService.findAll({funcionario: funcionario.id, orderBy: "dataCriacao", direction: Direction.DESC}),
            onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar as suspeitos.', color: 'red'}),
        },
        {
            queryKey: ["count-all-suspects"],
            queryFn: () =>  suspeitoService.count({}),
            onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar o total de suspeitos.', color: 'red'}),
        },
        {
            queryKey: [useId()],
            queryFn: () =>  ocorrenciaService.countByCreationDateBetween({funcionario: funcionario.id, dataInicio: new Date(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0).toISOString().replace("Z", ""), dataFim: new Date(now.getFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59).toISOString().replace("Z", ""),}),
            onError: (error: any) => notifications.show({title: 'Ocorrências de Hoje', message: error.message || 'Não foi possível carregar o total de ocorrências de hoje.', color: 'red'}),
        },
    ]);

    const handleChangeTabContext = (event: React.SyntheticEvent, newValue: string) => {
        setTabContext(newValue);
    };

    return (
        <>
            <Stack sx={{gap: 3}}>
                <Box>
                    <Typography variant="h2">Perfil</Typography>
                    <Divider orientation="horizontal"/>
                </Box>
                <TabContext value={tabContext}>
                    <Stack spacing={2} elevation={0} component={Paper} sx={{px: 2, pt: 2}}>
                        <Stack direction="row" sx={{gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start"}}>
                            <Stack direction="row" sx={{gap: 2, alignItems: "center", flexWrap: "wrap"}}>
                                <Box component="span" sx={{position: "relative", zIndex: 1}}>
                                    <Avatar sx={{width: 128, height: 128}} alt="Foto Perfil" src={resourceResolver.profilePhoto(funcionario.fotoPerfil)}/>
                                    <IconButton onClick={() => setOpenUpdateProfilePhotoDialog(true)} sx={{position: "absolute", zIndex: 2, bottom: 0, right: 0, transform: "translate(20%,-40%)", color: theme => theme.palette.primary.contrastText, bgcolor: theme => theme.palette.background.default, "&:hover": {bgcolor: theme => alpha(theme.palette.background.default, 0.9)}}}>
                                        <IconPhone style={{width: rem(20), height: rem(20)}}/>
                                    </IconButton>
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{fontWeight: 700}}>{funcionario.nome}</Typography>
                                    <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={funcionario.papel === Papel.ADMINISTRADOR ? "orange" : "green"} variant="light" size="xs" checked>{funcionario.papel}</Chip>
                                </Box>
                            </Stack>
                            <Stack direction="row" sx={{gap: 2, justifyContent: "flex-end", flexWrap: "wrap"}}>
                                <Button onClick={() => setOpenPhoneDialog(true)} color="primary" disableElevation variant="contained" startIcon={<IconPhone style={iconStyle}/>} sx={{color: "#fff"}}>Telefone</Button>
                                <Button onClick={() => setOpenUpdateProfileDialog(true)} color="primary" disableElevation variant="contained" startIcon={<IconUserEdit style={iconStyle}/>} sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Editar</Button>
                                <Button LinkComponent={Link} href="/settings" color="primary" disableElevation variant="contained" startIcon={<IconSettings style={iconStyle}/>} sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Configurações</Button>
                            </Stack>
                        </Stack>
                        <TabList variant="scrollable" onChange={handleChangeTabContext} aria-label="lab API tabs example">
                            <Tab label="Perfil" value={defaultPanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Ocorrências" value={occurrencePanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Requerentes" value={applicantPanelId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Suspeitos" value={suspectPanelId} sx={{color: theme => theme.palette.background.default}}/>
                        </TabList>
                    </Stack>
                    <TabPanel value={defaultPanelId} sx={{p: 0}}>
                        <Grid spacing={3} container>
                            <Grid xs={12} md={4}>
                                <EmployeeDetails funcionario={funcionario} totalSuspeitos={queries[0].data?.data} totalRequerentes={queries[1].data?.data} totalOcorrencias={queries[2].data?.data}/>
                            </Grid>
                            <Grid xs={12} md={8}>
                                <EmployeeNotifications loading={queries[3].isLoading} total={queries[3].data?.data.totalElements} notifications={queries[3].data?.data.content} />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={occurrencePanelId} sx={{p: 0}}>
                        <Stack gap={2}>
                            <Grid spacing={3} container>
                                <Grid xs={12} md={6}>
                                    <Counter label="Todal Ocorrências" loading={queries[2].isLoading} counter={queries[2].data?.data || 0} urlList="/occurrences" urlNew="/occurrences/new" color="primary"/>
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Counter label="Ocorrências Hoje" loading={queries[10].isLoading} counter={queries[10].data?.data || 0}  urlList="/occurrences" urlNew="/occurrences/new" color="info"/>
                                </Grid>
                            </Grid>
                            <Occurrences title="Minhas Ocorrências" ocorrencias={queries[4].data?.data} total={queries[5].data?.data}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={applicantPanelId} sx={{p: 0}}>
                        <Stack spacing={2}>
                            <Counter label="Requerentes" loading={queries[1].isLoading} counter={queries[1].data?.data || 0}  urlList="/applicants" urlNew="/applicants/new" color="info"/>
                            <Applicants title="Meus Cadastros de Requerentes" requerentes={queries[6].data?.data} total={queries[7].data?.data}/>
                        </Stack>
                    </TabPanel>
                    <TabPanel value={suspectPanelId} sx={{p: 0}}>
                        <Stack spacing={2}>
                            <Counter label="Suspeitos" loading={queries[0].isLoading} counter={queries[0].data?.data || 0}  urlList="/suspects" urlNew="/suspects/new" color="info"/>
                            <Suspects title="Meus Cadastros de Suspeitos" suspeitos={queries[8].data?.data} total={queries[9].data?.data}/>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Stack>
            <PhoneDialog open={openPhoneDialog} handleClose={() => setOpenPhoneDialog(false)} />
            <UpdateProfileDialog open={openUpdateProfileDialog} handleClose={() => setOpenUpdateProfileDialog(false)} />
            <UpdateProfilePhotoDialog open={openUpdateProfilePhotoDialog} handleClose={() => setOpenUpdateProfilePhotoDialog(false)} />
        </>
    )
}
