"use client";

import Image from "next/image";
import { useCallback, useReducer } from "react";
import { Chip } from "@mantine/core";
import MenuListItem from "./MenuListItem";
import { useAppSelector } from "@/redux/hooks";
import { selectTatals } from "@/redux/slicer/totalsSlicer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconCalendarDue, IconHome, IconLock, IconSettings, IconUser, IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { Box, Collapse, Divider, IconButton, List, Stack, Typography, alpha, styled, useMediaQuery, useTheme } from "@mui/material";
import { IconFiles, IconFolderPlus, IconGlobe, IconList, IconNotification, IconPlaylistAdd, IconRss } from "@tabler/icons-react";

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
    occurrences: false,
    applicants: false,
    employees: false,
    suspects: false,
    crimes: false,
}

const enum REDUCER_ACTION_TYPE {
    OCCURRENCES,
    APPLICANTS,
    EMPLOYEES,
    SUSPECTS,
    CRIMES,
}

const reducer = (state: typeof initialState, action: ReducerAction): typeof initialState => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.OCCURRENCES:
            return {...state, occurrences: action.payload, applicants: false,employees: false, suspects: false, crimes: false};
        case REDUCER_ACTION_TYPE.APPLICANTS:
            return {...state, occurrences: false, applicants: action.payload,employees: false, suspects: false, crimes: false};
        case REDUCER_ACTION_TYPE.EMPLOYEES:
            return {...state, occurrences: false, applicants: false,employees: action.payload, suspects: false, crimes: false};
        case REDUCER_ACTION_TYPE.SUSPECTS:
            return {...state, occurrences: false, applicants: false,employees: false, suspects: action.payload, crimes: false};
        case REDUCER_ACTION_TYPE.CRIMES:
            return {...state, occurrences: false, applicants: false,employees: false, suspects: false, crimes: action.payload};
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
    const totals = useAppSelector(selectTatals);
    const matchesClose = useMediaQuery(theme.breakpoints.down('lg'));
    const [stateReducer, dispatchReducer] = useReducer(reducer, initialState);
    const onClose = useCallback(() => {
        if (matchesClose) {
            handleClose();
        }
    }, [handleClose, matchesClose]);
    
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
                    <MenuListItem onClick={onClose} href="/" primary="Dashboard" Icon={IconHome} expanded={open && matches} />
                    <MenuListItem onClick={onClose} href="/profile" primary="Perfil" Icon={IconUser} expanded={open && matches} />
                </List>
                {open && matches && <Divider sx={{mx: 2}}/>}
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>ACÇÕES</Typography>
                <List disablePadding={!open}>
                    <MenuListItem 
                        primary="Ocorrências"
                        Icon={IconCalendarDue} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.occurrences ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        } 
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.OCCURRENCES, payload: !stateReducer.occurrences})} 
                    /> 
                    <Collapse in={stateReducer.occurrences} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem onClick={onClose} primary="Listagem" href="/occurrences" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>{totals.totalOccurrences}</Chip>} expanded={open && matches} /> 
                            <MenuListItem onClick={onClose} primary="Novo" href="/occurrences/new" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>

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
                            <MenuListItem onClick={onClose} primary="Listagem" href="/employees" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>{totals.totalEmployees}</Chip>} expanded={open && matches} /> 
                            <MenuListItem onClick={onClose} primary="Novo" href="/employees/new" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>

                    <MenuListItem 
                        primary="Requerentes"
                        Icon={IconRss} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.applicants ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        } 
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.APPLICANTS, payload: !stateReducer.applicants})} 
                    /> 
                    <Collapse in={stateReducer.applicants} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem onClick={onClose} primary="Listagem" href="/applicants" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>{totals.totalApplicants}</Chip>} expanded={open && matches} /> 
                            <MenuListItem onClick={onClose} primary="Novo" href="/applicants/new" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>

                    <MenuListItem 
                        primary="Suspeitos"
                        Icon={IconUsersGroup} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.suspects ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        } 
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.SUSPECTS, payload: !stateReducer.suspects})} 
                    /> 
                    <Collapse in={stateReducer.suspects} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem onClick={onClose} primary="Listagem" href="/suspects" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>{totals.totalSuspects}</Chip>} expanded={open && matches} /> 
                            <MenuListItem onClick={onClose} primary="Novo" href="/suspects/new" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>

                    <MenuListItem 
                        primary="Crimes"
                        Icon={IconFolderPlus} 
                        expanded={open && matches} 
                        secondaryAction={<ExpandMoreIcon sx={{
                            fontSize: 16,
                            transform: !stateReducer.crimes ? 'rotate(0deg)' : 'rotate(180deg)',
                            transition:(theme) => theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shortest,
                            })}}/>
                        } 
                        onClick={()=> dispatchReducer({type: REDUCER_ACTION_TYPE.CRIMES, payload: !stateReducer.crimes})} 
                    /> 
                    <Collapse in={stateReducer.crimes} timeout="auto" unmountOnExit>
                        <List disablePadding sx={{bgcolor: alpha(theme.palette.background.default, 0.05)}}>
                            <MenuListItem onClick={onClose} primary="Listagem" href="/crimes" Icon={IconList} secondaryAction={<Chip color="green" variant="light" checked>{totals.totalCrimes}</Chip>} expanded={open && matches} /> 
                            <MenuListItem onClick={onClose} primary="Novo" href="/crimes/new" Icon={IconPlaylistAdd} expanded={open && matches} /> 
                        </List>
                    </Collapse>

                    <MenuListItem onClick={onClose} primary="Notificações" href="/notifications" Icon={IconNotification} secondaryAction={<Chip color="#8747ff" variant="light" checked>{totals.totalNotifications}</Chip>} expanded={open && matches} /> 
                </List>
                {open && matches && <Divider sx={{mx: 2}}/>}
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>IMPRIMIR</Typography>
                <List disablePadding={!open}>
                    <MenuListItem onClick={onClose} href="/report" primary="Relatório" Icon={IconFiles} expanded={open && matches} />
                    <MenuListItem onClick={onClose} href="/bulletins" primary="Boletin" Icon={IconGlobe} expanded={open && matches} />
                </List>
                {open && matches && <Divider sx={{mx: 2}}/>}
                <Typography variant="body2" sx={{display: open && matches ? "block" : "none", px: 3, mt: 3, fontWeight: 700}}>OUTROS</Typography>
                <List disablePadding={!open}>
                    <MenuListItem onClick={onClose} href="/security&privacy" primary="Segurança e Privacidade" Icon={IconLock} expanded={open && matches} /> 
                    <MenuListItem onClick={onClose} href="/settings" primary="Configurações" Icon={IconSettings} expanded={open && matches} /> 
                </List>
            </Box>
        </>
    )
}
