"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Papel from "@/model/Papel";
import { GENERO } from "@/model/Genero";
import { useQueries } from "react-query";
import { Tooltip, rem } from "@mantine/core";
import { useAppSelector } from "@/redux/hooks";
import toolsManager from "@/util/ToolsManager";
import paisService from "@/service/PaisService";
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from "@mui/x-date-pickers";
import { notifications } from "@mantine/notifications";
import suspeitoService from "@/service/SuspeitoService";
import CardSuspect from "@/components/cards/CardSuspect";
import { Direction, Pagination } from "@/model/Pagination";
import Suspeito, { SUSPECT_ORDER_BY } from "@/model/Suspeito";
import { useCallback, useEffect, useId, useState } from "react";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { IconChevronDown, IconChevronUp, IconFilter, IconMessage, IconPlus, IconRestore, IconUser } from "@tabler/icons-react";
import { Box, Button, Divider, FormControl, List, ListItemButton, ListItemText, Menu, MenuItem, Pagination as MuiPagination, Paper, Select, SelectChangeEvent, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, alpha } from "@mui/material";

interface SuspectFilter extends Pagination {
    nome: string,
    genero: GENERO,
    pais: string,
    dataNascimento: string,
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const iconStyles = {width: rem(20), height: rem(20)};

export default function SuspectsPage() {
    const orderByPopupId = useId();
    const funcionarioSessao = useAppSelector(selectFuncionario);
    const [suspectFilter, setSuspectFilter] = useState<SuspectFilter>({page: 0, size: 8, nome: "", genero: "" as GENERO, dataNascimento: "", pais: "", orderBy: "nome", direction: Direction.ASC})
    const [queryCountSuspect, queryPaginationSuspect, queryCountries] = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["totalSuspects"],
            queryFn: () =>  suspeitoService.count({}),
            onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar o total de suspeitos.', color: 'red'}),
        },
        {
            enabled: false,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  suspeitoService.pagination(suspectFilter),
            onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar os suspeitos.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["contries"],
            queryFn: () =>  paisService.findAll({}),
            onError: (error: any) => notifications.show({title: 'Paises', message: error.message || 'Não foi possível carregar os paises,', color: 'red'}),
        }
    ]);

    const handleChangeGender = useCallback((evt: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setSuspectFilter({...suspectFilter, genero: (newValue ? newValue : "") as GENERO});
    }, [suspectFilter]);

    const handleChangeDirection = useCallback((evt: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setSuspectFilter({...suspectFilter, direction: (newValue ? newValue : "") as Direction});
    }, [suspectFilter]);

    const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
        setSuspectFilter({...suspectFilter, page: newPage - 1});
    }, [suspectFilter]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {~
        event.preventDefault();
        queryPaginationSuspect.refetch();
    }, [queryPaginationSuspect]);

    const handleReset = useCallback((event: React.FormEvent<HTMLButtonElement>) => {~
        event.preventDefault();
        setSuspectFilter({...suspectFilter, page: 0, nome: "", genero: "" as GENERO, dataNascimento: "", pais: "", orderBy: "nome", direction: Direction.ASC})
    }, [suspectFilter]);

    const handleDelete = useCallback((suspeito: Suspeito, setLoading: (loading: boolean) => void) => {
        setLoading(true);
        suspeitoService.delete(suspeito.id).then((response) => {
            queryPaginationSuspect.refetch();
            notifications.show({title: 'Suspeito', message: `Suspeito ${suspeito.nome} excluido com sucesso!!!`, color: 'green'})
        }).catch((error) => {
            console.log("ERROR: ", error);
            notifications.show({title: 'Suspeito', message: error?.response?.data?.message || `Não foi possível excluir o/a Suspeito/a ${suspeito.nome}.`, color: 'red'});
        }).finally(function() {
            setLoading(false);
        });
    }, [queryPaginationSuspect]);

    useEffect(() => {
        toolsManager.scrollTop();
        queryPaginationSuspect.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [suspectFilter.page, suspectFilter.genero, suspectFilter.orderBy, suspectFilter.direction]);

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Stack direction="row" sx={{justifyContent: "space-between", flexWrap: "wrap"}}>
                    <Typography variant="h2">Suspeitos ({queryCountSuspect.data?.data})</Typography>
                    <Button LinkComponent={Link} href="/suspects/new" color="primary" disableElevation variant="contained" startIcon={<IconPlus style={iconStyles}/>} sx={{color: "#fff"}}>Novo</Button>
                </Stack>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <Paper elevation={0} sx={{p: 2}}>
                <Stack spacing={2} component="form" onSubmit={handleSubmit} >
                    <Stack direction="row" sx={{gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}>
                        <TextField onChange={(evt) => setSuspectFilter({...suspectFilter, nome: evt.target.value})} value={suspectFilter.nome} variant="outlined" type="text" size="small" margin="normal" placeholder='Informe um nome...' InputProps={{ endAdornment: <IconUser style={iconStyles} fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="off" sx={{m: 0}}/>
                        <ToggleButtonGroup
                            exclusive
                            size="small"
                            color="primary"
                            aria-label="genero"
                            orientation="horizontal"
                            value={suspectFilter.genero}
                            onChange={handleChangeGender}
                        >
                            <Tooltip bg={'black'} label="Masculino" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                                <ToggleButton value={GENERO.MASCULINO} aria-label="male">
                                    <PersonOutlineOutlinedIcon />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip bg={'black'} label="Feminino" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                                <ToggleButton value={GENERO.FEMININO} aria-label="female">
                                    <Person2OutlinedIcon />
                                </ToggleButton>
                            </Tooltip>
                        </ToggleButtonGroup>
                        <DatePicker label="Data de Nascimento" value={suspectFilter.dataNascimento ? dayjs(suspectFilter.dataNascimento) : undefined} maxDate={dayjs(Date.now())} views={['day', 'month', 'year']} slotProps={{textField: { size: "small", required: false}, }} onChange={(newDate) => setSuspectFilter({...suspectFilter, dataNascimento: dayjs(newDate).format('YYYY-MM-DD')})}/>
                        <FormControl fullWidth sx={{maxWidth: 240}}>
                            <Select value={suspectFilter.pais} sx={{"& label": {color: theme => `${theme.palette.primary.contrastText}!important`}}} size="small" label="Nacionalidade" onChange={(evt: SelectChangeEvent<string>) => setSuspectFilter({...suspectFilter, pais: evt.target.value})} MenuProps={MenuProps}>
                                    <MenuItem disabled selected={true}>Selecione o pais</MenuItem>
                                {queryCountries.data?.data.map((pais) => (
                                    <MenuItem key={pais.id} value={pais.id}>{pais.nome}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Divider orientation="vertical" flexItem/>
                        <PopupState variant="popover" popupId={orderByPopupId}>
                            {(popupState) => (<>
                                <List component="nav" aria-label="Device settings" sx={{ bgcolor: 'background.paper', width: "100%", maxWidth: 240, py: 0}}>
                                    <ListItemButton {...bindTrigger(popupState)} aria-haspopup="listbox" aria-controls="lock-menu" aria-label="when device is locked" sx={{py: 0}}>
                                        <ListItemText
                                            primary={SUSPECT_ORDER_BY.find(o => o.value===suspectFilter.orderBy)?.label}
                                            secondary="Dado de ordernação"
                                        />
                                    </ListItemButton>
                                </List>
                                <Menu {...bindMenu(popupState)} anchorOrigin={{vertical: "bottom", horizontal: "left"}} transformOrigin={{vertical: "top", horizontal: "left"}} slotProps={{paper: {style: {padding: 20,},},}}>
                                    {SUSPECT_ORDER_BY.map((orderBy) => (
                                        <MenuItem key={orderBy.value} value={orderBy.value} onClick={()=>{
                                            popupState.close();
                                            setSuspectFilter({...suspectFilter, orderBy: orderBy.value});
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
                            value={suspectFilter.direction}
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
                    </Stack>
                    <Stack direction="row" sx={{gap: 2, justifyContent: "center", flexWrap: "wrap"}}>
                        <Button onClick={handleReset} variant="contained" disableElevation startIcon={<IconRestore style={iconStyles}/>} sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Limpar</Button>
                        <Button type="submit" variant="contained" disableElevation startIcon={<IconFilter style={iconStyles}/>} sx={{color: "#fff"}}>Filtar ({queryPaginationSuspect.data?.data.totalElements || 0})</Button>
                    </Stack>
                </Stack>
            </Paper>
            <Grid spacing={3} container>
                {queryPaginationSuspect.data?.data.content.map(suspeito => (
                    <Grid xs={12} sm={4} md={4} lg={3} key={suspeito.id}>
                        <CardSuspect suspeito={suspeito} handleDelete={funcionarioSessao.papel === Papel.ADMINISTRADOR ? handleDelete : undefined}/>
                    </Grid>
                ))}
            </Grid>
            <Stack direction="row" sx={{justifyContent: "center"}}>
                <MuiPagination disabled={queryPaginationSuspect.data?.data === undefined} page={suspectFilter.page + 1} count={queryPaginationSuspect.data?.data.totalPages || 0} onChange={handleChangePage} color="primary" sx={{"&, & *": {color: theme => `${theme.palette.primary.contrastText} !important`}}}/>
            </Stack>
        </Stack>
    )
}
