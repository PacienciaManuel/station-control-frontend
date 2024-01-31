"use client";

import NextLink from "next/link";
import { useState } from "react";
import Crime from "@/model/Crime";
import Funcionario from "@/model/Funcionario";
import { GridToolbar } from "@mui/x-data-grid";
import { ThreeDots } from "react-loader-spinner";
import EmployeeHover from "../popup/EmployeeHover";
import { Chip, Text, Tooltip, rem } from '@mantine/core';
import { bindHover } from "material-ui-popup-state";
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import CrimeDescriptionHover from "../popup/CrimeDescriptionHover";
import { IconEdit, IconLock, IconTrash } from "@tabler/icons-react";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Divider, Link, Paper, Stack, Typography, IconButton, Box } from '@mui/material';
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

interface Actions {
    crime: Crime,
    handleDelete?: (crime: Crime, setLoading:(loading:boolean) => void) => void,
}

interface CrimesProps {
    total?: number,
    title: string,
    crimes?: Crime[],
    handleDelete?: (crime: Crime, setLoading:(loading:boolean) => void) => void,
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', sortable: false, type: 'string', width: 280,},
    { field: 'vigor', headerName: 'Em Vigor',type: 'boolean', width: 100, description: 'Este é o total de ocorrências registradas por requerente.', renderCell: ({value}: GridRenderCellParams<any, boolean>) => (
        <Chip color={value === true ? "#0eb91c" : "#f00"} icon={<IconLock style={{width: rem(14), height: rem(14)}}/>} variant="light" size="xs" checked>{value === true ? "Sim" : "Não"}</Chip>
    )},
    { field: 'descricao', headerName: 'Descrição',type: 'actions', width: 100, description: 'Este é o total de ocorrências registradas por requerente.', renderCell: ({value}: GridRenderCellParams<any, Crime>) => (
        <CrimeDescriptionHover crime={value as Crime} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<Box {...bindHover(popupState)}><Chip color={value?.descricao ? "green" : "red"} icon={<IconLock style={{width: rem(14), height: rem(14)}}/>} variant="light" size="xs" checked>{value?.descricao ? "Sim" : "Não"}</Chip></Box>)}
        </CrimeDescriptionHover>
    )},
    { field: 'dataCriacao', headerName: 'Data de Criação',type: 'dateTime', width: 140},
    { field: 'dataAtualizacao', headerName: 'Data de Criação',type: 'dateTime', width: 140},
    { field: 'funcionario', headerName: 'Funcionário',type: 'string', width: 180, description: 'Estes são os funcionários que efetuaram os registros das ocorrências', renderCell: ({value}: GridRenderCellParams<any, Funcionario>) => (
        <EmployeeHover funcionario={value!} anchorOrigin={{vertical: 'top', horizontal: 'center',}} transformOrigin={{vertical: 'bottom', horizontal: 'center',}}>
            {(popupState) => (<Link {...bindHover(popupState)} component={NextLink} href={`/employees/${value?.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{value?.nome}</Link>)}
        </EmployeeHover>
    )},
    { field: 'actions', headerName: 'Acções', sortable: false, type: 'actions', width: 120, description: 'Veja os detalhes das ocorrências.', renderCell: ({value}: GridRenderCellParams<any, Actions>) => (
        <Stack direction="row" sx={{gap: 2, alignItems: "center"}}>
            <Tooltip bg={'black'} label="Editar" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                <IconButton LinkComponent={NextLink} href={`/crimes/${value?.crime.id}`}>
                    <IconEdit style={{width: rem(20), height: rem(20)}}/>
                </IconButton>
            </Tooltip>
            {value?.handleDelete && (function DeleteCrime(){
                const [loading, setLoading] = useState<boolean>(false);
                return (<>
                    {loading ? <ThreeDots visible={true} height="20" width="20" color="#f00" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" /> : (
                        <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                            <IconButton color="error" onClick={() => {
                                modals.openConfirmModal({
                                    title: 'Exclusão de Funcionário',
                                    children: (
                                        <Typography variant="body2" sx={{color: "#000"}}>
                                            <Text style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit"}}>Deseja excluir os dados do crime <b>{value!.crime.nome}</b>?</Text>
                                        </Typography>
                                    ),
                                    labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
                                    onConfirm: () => value.handleDelete!(value!.crime, setLoading),
                                    onCancel: () => notifications.show({title: 'Exclusão de Crime', message: "Operação cancelada com sucesso.", color: "blue"}),
                                })
                            }}>
                                <IconTrash style={{width: rem(20), height: rem(20)}}/>
                            </IconButton>
                        </Tooltip>
                    )}
                </>);
            }())}
        </Stack>
    )},
];

export default function Crimes({crimes, title, handleDelete, total=0}:CrimesProps) {
    return (
        <Stack elevation={0} component={Paper} sx={{p: 2, }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">{title}</Typography>
                <Button LinkComponent={NextLink} href="/occurrences" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            <Divider orientation="horizontal" flexItem sx={{mb: 2}}/>
            <DataGrid
                rows={crimes ? crimes?.map(crime => ({
                    id: crime.id,
                    nome: crime.nome,
                    vigor: crime.vigor,
                    dataCriacao: new Date(crime.dataCriacao),
                    dataAtualizacao: new Date(crime.dataAtualizacao),
                    descricao: crime,
                    funcionario: crime.funcionario,
                    actions: {crime, handleDelete} as Actions,
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
