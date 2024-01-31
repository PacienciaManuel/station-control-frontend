"use client";

import NextLink from "next/link";
import Telefone from "@/model/Telefone";
import Requerente from "@/model/Requerente";
import toolsManager from "@/util/ToolsManager";
import { Chip, Tooltip, rem } from '@mantine/core';
import { bindHover } from "material-ui-popup-state";
import resourceResolver from "@/util/ResourceResolver";
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import ApplicantOccurrencesHover from "../popup/ApplicantOccurrencesHover";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IconHome2, IconPhone, IconTrash } from "@tabler/icons-react";
import { Button, Chip as MuiChip, Divider, Link, Paper, Stack, Typography, IconButton, Avatar } from '@mui/material';
import { GridToolbar } from "@mui/x-data-grid";
import { IconCalendarDue } from "@tabler/icons-react";

interface Actions {
    requerente: Requerente,
    handleDelete?: (requerente: Requerente) => void,
}

interface ApplicantsProps {
    total?: number,
    title: string,
    requerentes?: Requerente[],
    handleDelete?: (requerente: Requerente) => void,
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', sortable: false, type: 'string', width: 240, renderCell: ({value}: GridRenderCellParams<any, Requerente>) => (
        <Stack spacing={1} direction="row" sx={{alignItems: "center"}}>
            <Avatar src={resourceResolver.profilePhoto(value?.fotoPerfil)} alt={value!.nome} sx={{color: "#fff", fontSize: rem(16), width: 24, height: 24, backgroundColor: toolsManager.generateColor(value!.nome)}}>{value!.nome.charAt(0).toUpperCase()} </Avatar>
            <Tooltip bg={'black'} label={value?.nome} position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <Link component={NextLink} href={`/applicants/${value!.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{value!.nome}</Link>
            </Tooltip>
        </Stack>
    )},
    { field: 'genero', headerName: 'Gênero',type: 'string', width: 140},
    { field: 'dataNascimento', headerName: 'Data de Nascimento',type: 'date', width: 140},
    { field: 'morada', headerName: 'Morada',type: 'string', width: 200, description: 'Em caso de mudança o mesmo deve ser atualizado.', renderCell: ({value}: GridRenderCellParams<any, string>) => (
        <Tooltip bg={'black'} label={value} position='top' transitionProps={{transition: 'slide-down'}} withArrow>
            <Typography variant="body2">{value}</Typography>
        </Tooltip>
    )},
    { field: 'bilheteIdentidade', headerName: 'BI',type: 'string', width: 180, description: 'Em caso de mudança o mesmo deve ser atualizado.', renderCell: ({value}: GridRenderCellParams<any, string>) => (
        <Tooltip bg={'black'} label={value} position='top' transitionProps={{transition: 'slide-down'}} withArrow>
            <Typography variant="body2">{value}</Typography>
        </Tooltip>
    )},
    { field: 'dataCriacao', headerName: 'Data de Criação',type: 'dateTime', width: 140},
    { field: 'totalOcorrencias', headerName: 'Ocorrências',type: 'actions', width: 100, description: 'Este é o total de ocorrências registradas por requerente.', renderCell: ({value}: GridRenderCellParams<any, Requerente>) => (
        <ApplicantOccurrencesHover requerente={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<MuiChip {...bindHover(popupState)} label={value!.totalOcorrencias} color={value!.totalOcorrencias > 10 ? "default" : (value!.totalOcorrencias > 5 ? "primary" : "info")} variant="outlined" size="small" icon={<IconCalendarDue style={{width: rem(14), height: rem(14)}}/>}/>)}
        </ApplicantOccurrencesHover>
    )},
    { field: 'pais', headerName: 'Pais',type: 'string', width: 100, description: 'Este é a nacionalidade dos requerentes', renderCell: ({value}: GridRenderCellParams<any, string>) => (
        <Tooltip bg={'black'} label={value} position='top' transitionProps={{transition: 'slide-down'}} withArrow>
            <Typography variant="body2">{value}</Typography>
        </Tooltip>
    )},
    { field: 'telefone', headerName: 'Telefone',type: 'actions', width: 140, description: 'Este é o total de ocorrências registradas por requerente.', renderCell: ({value}: GridRenderCellParams<any, Telefone>) => (
        <Chip color={"green"} variant="outlined" size="xs" checked icon={<IconPhone style={{width: rem(14), height: rem(14)}}/>}>{value!.numero}</Chip>
    )},
    { field: 'actions', headerName: 'Acções', sortable: false, type: 'actions', width: 120, description: 'Veja os detalhes das ocorrências.', renderCell: ({value}: GridRenderCellParams<any, Actions>) => (
        <Stack spacing={1} direction="row">
            <Tooltip bg={'black'} label="Ver todos Detalhes" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton LinkComponent={NextLink} href={`/applicants/${value?.requerente.id}`}>
                    <IconHome2 style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            {value?.handleDelete && (
            <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton color="error" onClick={() => value.handleDelete!(value!.requerente)}>
                    <IconTrash style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            )}
        </Stack>
    )},
];

export default function Applicants({requerentes, title, handleDelete, total=0}:ApplicantsProps) {
    return (
        <Stack elevation={0} component={Paper} sx={{p: 2, }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">{title}</Typography>
                <Button LinkComponent={NextLink} href="/applicants" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            <Divider orientation="horizontal" flexItem sx={{mb: 2}}/>
            <DataGrid
                rows={requerentes?.map(requerente => ({
                    id: requerente.id,
                    nome: requerente,
                    genero: requerente.genero,
                    dataNascimento: new Date(requerente.dataNascimento),
                    morada: requerente.morada,
                    bilheteIdentidade: requerente.bilheteIdentidade,
                    dataCriacao: new Date(requerente.dataCriacao),
                    totalOcorrencias: requerente,
                    pais: requerente.pais.nome,
                    telefone: requerente.telefone,
                    actions: {requerente, handleDelete} as Actions,
                })) || []}
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
