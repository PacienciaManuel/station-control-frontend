"use client";

import Link from "next/link";
import { useQueries } from "react-query";
import { Tooltip, rem } from "@mantine/core";
import toolsManager from "@/util/ToolsManager";
import Crimes from "@/components/tables/Crimes";
import crimeService from "@/service/CrimeService";
import { IconRestore } from "@tabler/icons-react";
import { IconChevronUp } from "@tabler/icons-react";
import Crime, { CRIME_ORDER_BY } from "@/model/Crime";
import { notifications } from "@mantine/notifications";
import { Direction, Pagination } from "@/model/Pagination";
import funcionarioService from "@/service/FuncionarioService";
import { useCallback, useEffect, useId, useState } from "react";
import { IconChevronDown, IconFilter } from "@tabler/icons-react";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { IconFolderPlus, IconPlus, IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { Box, Button, Divider, List, ListItemButton, ListItemText, Menu, MenuItem, Pagination as MuiPagination, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, alpha } from "@mui/material";
import useErrorHandler from "@/hooks/useErrorHandler";


interface CrimeFilter extends Pagination {
    nome: string,
    funcionario: string,
    vigor: "true" | "false",
}

const iconStyles = {width: rem(20), height: rem(20)};

export default function CrimesPage() {
    const orderByPopupId = useId();
    const errorHandler = useErrorHandler("Crime");
    const [employeeName, setEmployeeName] = useState<string>("");
    const [crimeFilter, setCrimeFilter] = useState<CrimeFilter>({page: 0, size: 20, nome: "", vigor:"" as "false", funcionario: "", orderBy: "nome", direction: Direction.ASC})
    const [queryCountCrimes, queryPaginationCrimes, queryPaginationEmployees] = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["totalCrimes"],
            queryFn: () =>  crimeService.count({}),
            onError: (error: any) => errorHandler(error),
        },
        {
            enabled: false,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  crimeService.pagination(crimeFilter),
            onError: (error: any) => errorHandler(error),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["employees"],
            queryFn: () =>  funcionarioService.pagination({page: 0, size: 20, nome: employeeName}),
            onError: (error: any) => errorHandler(error),
        }
    ]);

    const handleChangeVigor = useCallback((evt: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setCrimeFilter({...crimeFilter, vigor: (newValue ? newValue : "") as "false"});
    }, [crimeFilter]);

    const handleChangeDirection = useCallback((evt: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setCrimeFilter({...crimeFilter, direction: (newValue ? newValue : "") as Direction});
    }, [crimeFilter]);

    const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
        setCrimeFilter({...crimeFilter, page: newPage - 1});
    }, [crimeFilter]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {~
        event.preventDefault();
        queryPaginationCrimes.refetch();
    }, [queryPaginationCrimes]);

    const handleReset = useCallback((event: React.FormEvent<HTMLButtonElement>) => {~
        event.preventDefault();
        setCrimeFilter({...crimeFilter, page: 0, size: 8, nome: "", vigor:"" as "false", funcionario: "", orderBy: "nome", direction: Direction.ASC})
    }, [crimeFilter]);

    const handleDelete = useCallback((crime: Crime, setLoading:(loading:boolean) => void) => {
        setLoading(true);
        crimeService.delete(crime.id).then((response) => {
            queryPaginationCrimes.refetch();
            notifications.show({title: 'Exclusão de Crime', message: `Crime excluido com sucesso!!!`, color: 'green'})
        }).catch(errorHandler).finally(function() {
            setLoading(false);
        });
    }, [queryPaginationCrimes, errorHandler]);

    useEffect(() => {
        toolsManager.scrollTop();
        queryPaginationCrimes.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crimeFilter.page, crimeFilter.vigor, crimeFilter.orderBy, crimeFilter.direction])

    return (
        
        <Stack sx={{gap: 3}}>
            <Box>
                <Stack direction="row" sx={{justifyContent: "space-between", flexWrap: "wrap"}}>
                    <Typography variant="h2">Crimes ({queryCountCrimes.data?.data})</Typography>
                    <Button LinkComponent={Link} href="/crimes/new" color="primary" disableElevation variant="contained" startIcon={<IconPlus style={iconStyles}/>} sx={{color: "#fff"}}>Novo</Button>
                </Stack>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <Paper elevation={0} sx={{p: 2}}>
                {/* <Stack  direction="row" sx={{gap: 2, justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap"}}>
                </Stack> */}
                <Stack component="form" onSubmit={handleSubmit} direction="row" sx={{gap: 2, flexWrap: "wrap", alignItems: "center"}}>
                    <TextField onChange={(evt) => setCrimeFilter({...crimeFilter, nome: evt.target.value})} value={crimeFilter.nome} variant="outlined" type="text" size="small" margin="normal" placeholder='Informe um nome...' InputProps={{ endAdornment: <IconFolderPlus style={iconStyles} fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="off" sx={{m: 0}}/>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        color="primary"
                        aria-label="vigor"
                        orientation="horizontal"
                        value={crimeFilter.vigor}
                        onChange={handleChangeVigor}
                    >
                        <Tooltip bg={'black'} label="Ainda em Vigor" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                            <ToggleButton value={"true"} aria-label="male">
                                    <IconThumbUp  style={iconStyles}/>
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip bg={'black'} label="Revogado" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                            <ToggleButton value={"false"} aria-label="female">
                                <IconThumbDown style={iconStyles}/>
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                    <Divider orientation="vertical" flexItem/>
                    <PopupState variant="popover" popupId={orderByPopupId}>
                        {(popupState) => (<>
                            <List component="nav" aria-label="Device settings" sx={{ bgcolor: 'background.paper', width: "100%", maxWidth: 240, py: 0}}>
                                <ListItemButton {...bindTrigger(popupState)} aria-haspopup="listbox" aria-controls="lock-menu" aria-label="when device is locked" sx={{py: 0}}>
                                    <ListItemText
                                        primary={CRIME_ORDER_BY.find(o => o.value===crimeFilter.orderBy)?.label}
                                        secondary="Dado de ordernação"
                                    />
                                </ListItemButton>
                            </List>
                            <Menu {...bindMenu(popupState)} anchorOrigin={{vertical: "bottom", horizontal: "left"}} transformOrigin={{vertical: "top", horizontal: "left"}} slotProps={{paper: {style: {padding: 20,},},}}>
                                {CRIME_ORDER_BY.map((orderBy) => (
                                    <MenuItem key={orderBy.value} value={orderBy.value} onClick={()=>{
                                        popupState.close();
                                        setCrimeFilter({...crimeFilter, orderBy: orderBy.value});
                                    }}>{orderBy.label}</MenuItem>
                                ))}
                            </Menu>
                        </>)}
                    </PopupState>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        color="primary"
                        aria-label="genero"
                        orientation="horizontal"
                        value={crimeFilter.direction}
                        onChange={handleChangeDirection}
                    >
                        <Tooltip bg={'black'} label="Ascendente" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                            <ToggleButton value={Direction.ASC} aria-label="asc">
                                    <IconChevronUp style={iconStyles}/>
                            </ToggleButton>
                        </Tooltip>
                        <Tooltip bg={'black'} label="Descendente" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                            <ToggleButton value={Direction.DESC} aria-label="desc">
                                <IconChevronDown style={iconStyles}/>
                            </ToggleButton>
                        </Tooltip>
                    </ToggleButtonGroup>
                <Button onClick={handleReset} variant="contained" disableElevation startIcon={<IconRestore style={iconStyles}/>} sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Limpar</Button>
                <Button type="submit" variant="contained" disableElevation startIcon={<IconFilter style={iconStyles}/>} sx={{color: "#fff"}}>Filtar ({queryPaginationCrimes.data?.data.totalElements || 0})</Button>
                </Stack>
            </Paper>
            <Crimes title="Crimes" crimes={queryPaginationCrimes.data?.data.content} total={queryCountCrimes.data?.data || 0} handleDelete={handleDelete}/>
            <Stack direction="row" sx={{justifyContent: "center"}}>
                <MuiPagination disabled={queryPaginationCrimes.data?.data === undefined} page={crimeFilter.page + 1} count={queryPaginationCrimes.data?.data.totalPages || 0} onChange={handleChangePage} color="primary" sx={{"&, & *": {color: theme => `${theme.palette.primary.contrastText} !important`}}}/>
            </Stack>
        </Stack>
    )
}
