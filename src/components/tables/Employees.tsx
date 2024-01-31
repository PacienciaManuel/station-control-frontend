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
import SuspectsHover from "../popup/OccurrenceSuspectsHover";
import { bindHover } from "material-ui-popup-state";
import ApplicantHover from "../popup/ApplicantHover";
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconFolderPlus, IconHome2, IconTools, IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { Button, Chip as MuiChip, Divider, Link, Paper, Stack, Typography, IconButton, Avatar } from '@mui/material';
import resourceResolver from "@/util/ResourceResolver";
import toolsManager from "@/util/ToolsManager";
import { IconShieldLock } from "@tabler/icons-react";
import Papel from "@/model/Papel";
import EmployeeApplicantsHover from "../popup/EmployeeApplicantsHover";

interface Actions {
    funcionario: Funcionario,
    handleDelete?: (funcionario: Funcionario) => void,
}

interface EmployeesProps {
    total?: number,
    title: string,
    funcionarios?: Funcionario[],
    handleDelete?: (funcionario: Funcionario) => void,
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', sortable: false, type: 'string', width: 180, renderCell: ({value}: GridRenderCellParams<any, Funcionario>) => (
        <Stack spacing={1} direction="row" sx={{alignItems: "center"}}>
            <Avatar src={resourceResolver.profilePhoto(value!.fotoPerfil)} alt={value!.nome} sx={{color: "#fff", width: 20, height: 20, backgroundColor: toolsManager.generateColor(value!.nome)}}>{value!.nome.charAt(0).toUpperCase()} </Avatar>
            <Link component={NextLink} href={`/profile/${value!.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{value!.nome}</Link>
        </Stack>
    )},
    { field: 'genero', headerName: 'Gênero',type: 'actions', width: 140},
    { field: 'dataNascimento', headerName: 'Data de Nascimento',type: 'date', width: 140},
    { field: 'email', headerName: 'Email',type: 'actions', width: 180, description: 'O email de cada funcionãrio é único.'},
    { field: 'morada', headerName: 'Morada',type: 'string', width: 180, description: 'Em caso de mudança o mesmo deve ser atualizado.'},
    { field: 'papel', headerName: 'Papel',type: 'actions', width: 180, description: 'Estes são os funcionários que efetuaram os registros das ocorrências', renderCell: ({value}: GridRenderCellParams<any, Funcionario>) => (
        <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={value!.papel === Papel.ADMINISTRADOR ? "red" : "green"} variant="light" size="xs" checked>{value!.papel}</Chip>
    )},
    { field: 'totalRequerentes', headerName: 'Requerentes Cadastrados',type: 'string', width: 180, description: 'Estes são os requerentes das ocorrências', renderCell: ({value}: GridRenderCellParams<any, Funcionario>) => (
        <EmployeeApplicantsHover funcionario={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<MuiChip {...bindHover(popupState)} label={value!.totalRequerentes} color={value!.totalRequerentes > 100 ? "default" : (value!.totalRequerentes > 50 ? "primary" : "info")} variant="outlined" size="small" icon={<IconTools style={{width: rem(14), height: rem(14)}}/>}/>)}
        </EmployeeApplicantsHover> 
    )},
    { field: 'actions', headerName: 'Acções', sortable: false, type: 'actions', width: 120, description: 'Veja os detalhes das ocorrências.', renderCell: ({value}: GridRenderCellParams<any, Actions>) => (
        <Stack spacing={1} direction="row">
            <Tooltip bg={'black'} label="Ver todos Detalhes" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton LinkComponent={NextLink} href={`/occurrences/${value?.funcionario.id}`}>
                    <IconHome2 style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            {value?.handleDelete && (
            <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton color="error" onClick={() => value.handleDelete!(value!.funcionario)}>
                    <IconTrash style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            )}
        </Stack>
    )},
];

export default function Occurrences({funcionarios, title, handleDelete, total=0}:EmployeesProps) {
    return (
        <Stack elevation={0} component={Paper} sx={{p: 2, }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">{title}</Typography>
                <Button LinkComponent={NextLink} href="/occurrences" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            <Divider orientation="horizontal" flexItem sx={{mb: 2}}/>
            <DataGrid
                rows={funcionarios ? funcionarios?.map(funcionario => ({
                    // id: ocorrencia.id,
                    // status: ocorrencia.status,
                    // totalObjectos: ocorrencia,
                    // totalCrimes: ocorrencia,
                    // totalSuspeitos: ocorrencia,
                    // dataOcorrencia: new Date(ocorrencia.dataOcorrencia),
                    // dataAtualizacao: new Date(ocorrencia.dataAtualizacao),
                    // funcionario: ocorrencia.funcionario,
                    // requerente: ocorrencia.requerente,
                    // actions: {ocorrencia, handleDelete} as Actions,
                })) : []}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                autoHeight
                pageSizeOptions={[5, 10]}
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                sx={{ '--DataGrid-overlayHeight': '300px' }}
            />
        </Stack>
    )
}
