"use client";

import NextLink from "next/link";
import Status from '@/model/Status';
import Requerente from "@/model/Requerente";
import Ocorrencia from '@/model/Ocorrencia';
import Funcionario from "@/model/Funcionario";
import CrimesHover from "../popup/CrimesHover";
import ObjectsHover from "../popup/ObjectsHover";
import { Chip, Tooltip, rem } from '@mantine/core';
import EmployeeHover from "../popup/EmployeeHover";
import { bindHover } from "material-ui-popup-state";
import ApplicantHover from "../popup/ApplicantHover";
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import SuspectsHover from "../popup/OccurrenceSuspectsHover";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { IconFile, IconFolderPlus, IconHome2, IconTools, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { Button, Chip as MuiChip, Divider, Link, Paper, Stack, Typography, IconButton } from '@mui/material';

interface Actions {
    ocorrencia: Ocorrencia,
    handleDelete?: (ocorrencia: Ocorrencia) => void,
}

interface OccurrencesProps {
    total?: number,
    title: string,
    ocorrencias?: Ocorrencia[],
    handleDelete?: (ocorrencia: Ocorrencia) => void,
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'status', headerName: 'Status', sortable: false, type: 'actions', width: 120, description: 'Este é o estado atual da ocorrência.', renderCell: ({value}: GridRenderCellParams<any, Status>) => (
        <Chip color={value === Status.ANALISE ? "#f00" : (value === Status.PROGRESSO ? "#008cff" : "#0eb91c")} variant="light" size="xs" checked>{value}</Chip>
    )},
    { field: 'totalObjectos', headerName: 'Total de Objectos',type: 'actions', width: 140, description: 'Este é o total de objectos que a ocorrência tem.', renderCell: ({value}: GridRenderCellParams<any, Ocorrencia>) => (
        <ObjectsHover ocorrencia={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<MuiChip {...bindHover(popupState)} label={value!.totalObjectos} color={value!.totalObjectos > 100 ? "default" : (value!.totalObjectos > 50 ? "primary" : "info")} variant="outlined" size="small" icon={<IconTools style={{width: rem(14), height: rem(14)}}/>}/>)}
        </ObjectsHover>
    )},
    { field: 'totalCrimes', headerName: 'Todal Crimes',type: 'actions', width: 140, description: 'Este é o total de crimes que a ocorrência tem.', renderCell: ({value}: GridRenderCellParams<any, Ocorrencia>) => (
        <CrimesHover ocorrencia={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<MuiChip {...bindHover(popupState)} label={value!.totalCrimes} color={value!.totalCrimes > 100 ? "default" : (value!.totalCrimes > 50 ? "primary" : "info")} variant="outlined" size="small" icon={<IconFolderPlus style={{width: rem(14), height: rem(14)}}/>}/>)}
        </CrimesHover>  
    )},
    { field: 'totalSuspeitos', headerName: 'Total Suspeitos',type: 'actions', width: 140, description: 'Este é o total de suspeitos que a ocorrência tem.', renderCell: ({value}: GridRenderCellParams<any, Ocorrencia>) => (
        <SuspectsHover ocorrencia={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<MuiChip {...bindHover(popupState)} label={value!.totalSuspeitos} color={value!.totalSuspeitos > 100 ? "default" : (value!.totalSuspeitos > 50 ? "primary" : "info")} variant="outlined" size="small" icon={<IconUsersGroup style={{width: rem(16), height: rem(16)}}/>}/> )}
        </SuspectsHover>
    )},
    { field: 'totalArquivos', headerName: 'Total Arquivos',type: 'actions', width: 140, description: 'Este é o total de arquivos que a ocorrência tem.', renderCell: ({value}: GridRenderCellParams<any, number>) => (
        <MuiChip label={value} color={value! > 10 ? "default" : (value! > 5 ? "primary" : "info")} variant="outlined" size="small" icon={<IconFile style={{width: rem(16), height: rem(16)}}/>}/>
    )},
    { field: 'dataOcorrencia', headerName: 'Data da Ocorrência',type: 'dateTime', width: 180, description: 'Estas são as datas em que as ocorrências foram registros'},
    { field: 'dataAtualizacao', headerName: 'Última Atualização',type: 'dateTime', width: 180, description: 'Está é a última data é que esta ocorrência foi registrada'},
    { field: 'funcionario', headerName: 'Funcionário',type: 'string', width: 180, description: 'Estes são os funcionários que efetuaram os registros das ocorrências', renderCell: ({value}: GridRenderCellParams<any, Funcionario>) => (
        <EmployeeHover funcionario={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<Link {...bindHover(popupState)} component={NextLink} href={`/employees/${value?.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{value?.nome}</Link>)}
        </EmployeeHover>
    )},
    { field: 'requerente', headerName: 'Requerente',type: 'string', width: 180, description: 'Estes são os requerentes das ocorrências', renderCell: ({value}: GridRenderCellParams<any, Requerente>) => (
        <ApplicantHover requerente={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<Link {...bindHover(popupState)} component={NextLink} href={`/applicants/${value?.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{value?.nome}</Link>)}
        </ApplicantHover> 
    )},
    { field: 'actions', headerName: 'Acções', sortable: false, type: 'actions', width: 120, description: 'Veja os detalhes das ocorrências.', renderCell: ({value}: GridRenderCellParams<any, Actions>) => (
        <Stack spacing={1} direction="row">
            <Tooltip bg={'black'} label="Ver todos Detalhes" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton LinkComponent={NextLink} href={`/occurrences/${value?.ocorrencia.id}`}>
                    <IconHome2 style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            {value?.handleDelete && (
            <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton color="error" onClick={() => value.handleDelete!(value!.ocorrencia)}>
                    <IconTrash style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            )}
        </Stack>
    )},
];

export default function Occurrences({ocorrencias, title, handleDelete, total=0}:OccurrencesProps) {
    return (
        <Stack elevation={0} component={Paper} sx={{p: 2, }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">{title}</Typography>
                <Button LinkComponent={NextLink} href="/occurrences" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            <Divider orientation="horizontal" flexItem sx={{mb: 2}}/>
            <DataGrid
                rows={ocorrencias ? ocorrencias?.map(ocorrencia => ({
                    id: ocorrencia.id,
                    status: ocorrencia.status,
                    totalObjectos: ocorrencia,
                    totalCrimes: ocorrencia,
                    totalSuspeitos: ocorrencia,
                    totalArquivos: ocorrencia.totalArquivos,
                    dataOcorrencia: new Date(ocorrencia.dataOcorrencia),
                    dataAtualizacao: new Date(ocorrencia.dataAtualizacao),
                    funcionario: ocorrencia.funcionario,
                    requerente: ocorrencia.requerente,
                    actions: {ocorrencia, handleDelete} as Actions,
                })) : []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                autoHeight
                pageSizeOptions={[5, 6, 7, 8, 9, 10]}
                slots={{ noRowsOverlay: CustomNoRowsOverlay, toolbar: GridToolbar }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Stack>
    )
}
