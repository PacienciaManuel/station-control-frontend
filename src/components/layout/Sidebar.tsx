"use client";

import Image from "next/image";
import { useReducer } from "react";
import { Chip } from "@mantine/core";
import MenuListItem from "./MenuListItem";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconCalendarDue, IconHome, IconUser, IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { Box, Collapse, Divider, IconButton, List, Stack, Typography, alpha, styled, useTheme } from "@mui/material";
import { IconFiles, IconFolderPlus, IconGlobe, IconList, IconListDetails, IconNotification, IconPlaylistAdd, IconRss } from "@tabler/icons-react";

interface SidebarProps { 
    open: boolean,
    matches: boolean,
    handleClose: () => void,
}

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const initialState = {
    employees: false,
    inmates: false,
}

const enum REDUCER_ACTION_TYPE {
    EMPLOYEES,
    INMATES,
}

const reducer = (state: typeof initialState, action: ReducerAction): typeof initialState => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.EMPLOYEES:
            return {...state, employees: action.payload, inmates: false };
        case REDUCER_ACTION_TYPE.INMATES:
            return {...state, employees: false, inmates: action.payload };
        default: 
            throw new Error(`Action ${action.type}`);
    }
}

type ReducerAction = {
    payload: boolean,
    type: REDUCER_ACTION_TYPE,
}

export default function Sidebar({ open, matches, handleClose }:SidebarProps) {
    const theme = useTheme();
    const [stateReducer, dispatchReducer] = useReducer(reducer, initialState);

    return (
        <>
            <DrawerHeader>
                <Stack spacing={2} direction="row" sx={{alignItems: "center"}}>
                    <Image width={30} height={40} src="/img/logo-symbol.png" alt="Logo" style={{display: "block", margin: "auto"}}/>
                    <Typography variant="body1" sx={{fontWeight: 700, textTransform: "uppercase"}}>Station Control</Typography>
                </Stack>
                <IconButton onClick={handleClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider orientation="horizontal" />
            <Box sx={{
                overflowY: "auto", 
                overflowX: "hidden", 
                transition: "all .4s ease", 
                "&::-webkit-scrollbar": {width: 0}, 
                "&:hover::-webkit-scrollbar": {
                    width: open && matches ? 10 : 0,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: theme => alpha(theme.palette.background.default, 0.05), 
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: theme => alpha(theme.palette.background.default, 0.25), 
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: theme => alpha(theme.palette.background.default, 0.35), 
                },
            }}>
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>NAVEGAÇÃO</Typography>
                <List disablePadding={!open}>
                    <MenuListItem href="/" primary="Home" Icon={IconHome} expanded={open && matches} />
                    <MenuListItem href="/profile" primary="Perfil" Icon={IconUser} expanded={open && matches} />
                </List>
                {open && matches && <Divider sx={{mx: 2}}/>}
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>ACÇÕES</Typography>
                <List disablePadding={!open}>
                    <MenuListItem primary="Ocorrência" Icon={IconCalendarDue} secondaryAction={<Chip color="red" variant="light" checked>2</Chip>} expanded={open && matches} /> 
                    <MenuListItem 
                        primary="Funcionários"
                        Icon={IconUsers} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.employees ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        } 
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.EMPLOYEES, payload: !stateReducer.employees})} 
                    /> 
                    <Collapse in={stateReducer.employees} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem primary="Listagem" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>220</Chip>} expanded={open && matches} /> 
                            <MenuListItem primary="Novo" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>
                    <MenuListItem primary="Informar" Icon={IconRss} expanded={open && matches} />
                    <MenuListItem 
                        primary="Detentos" 
                        Icon={IconUsersGroup} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.inmates ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        }  
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.INMATES, payload: !stateReducer.inmates})} 
                    /> 
                    <Collapse in={stateReducer.inmates} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem primary="Listagem" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>220</Chip>} expanded={open && matches} /> 
                            <MenuListItem primary="Novo" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>
                    <MenuListItem primary="Notificações" Icon={IconNotification} secondaryAction={<Chip color="#8747ff" variant="light" checked>2</Chip>} expanded={open && matches} /> 
                    <MenuListItem primary="Boletins" Icon={IconFolderPlus} expanded={open && matches} />
                </List>
                {open && matches && <Divider sx={{mx: 2}}/>}
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>IMPRIMIR</Typography>
                <List disablePadding={!open}>
                    <MenuListItem primary="Relatório" Icon={IconFiles} expanded={open && matches} />
                    <MenuListItem primary="Boletin" Icon={IconGlobe} expanded={open && matches} />
                    <MenuListItem primary="Lista de Detentos" Icon={IconListDetails} secondaryAction={<Chip color="blue" variant="light" checked>new</Chip>} expanded={open && matches} /> 
                </List>
            </Box>
        </>
    )
}
