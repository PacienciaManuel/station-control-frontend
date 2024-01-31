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
import { Direction, Pagination } from "@/model/Pagination";
import CardEmployee from "@/components/cards/CardEmployee";
import funcionarioService from "@/service/FuncionarioService";
import { useCallback, useEffect, useId, useState } from "react";
import Funcionario, { EMPLOYEE_ORDER_BY } from "@/model/Funcionario";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { IconChevronDown, IconChevronUp, IconFilter, IconMessage, IconPlus, IconRestore, IconUser } from "@tabler/icons-react";
import { Box, Button, Divider, FormControl, List, ListItemButton, ListItemText, Menu, MenuItem, Pagination as MuiPagination, Paper, Select, SelectChangeEvent, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, alpha } from "@mui/material";

interface EmployeeFilter extends Pagination {
    nome: string,
    email: string,
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

export default function EmployeesPage() {
    const orderByPopupId = useId();
    const funcionarioSessao = useAppSelector(selectFuncionario);
    const [employeeFilter, setEmployeeFilter] = useState<EmployeeFilter>({page: 0, size: 8, nome: "", genero: "" as GENERO, dataNascimento: "", email: "", pais: "", orderBy: "nome", direction: Direction.ASC})
    const [queryCountEmployee, queryPaginationEmployee, queryCountries] = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["totalEmployees"],
            queryFn: () =>  funcionarioService.count(),
            onError: (error: any) => notifications.show({title: 'Funcionários', message: error.message || 'Não foi possível carregar o total de funcionários.', color: 'red'}),
        },
        {
            enabled: false,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: [useId()],
            queryFn: () =>  funcionarioService.pagination(employeeFilter),
            onError: (error: any) => notifications.show({title: 'Funcionários', message: error.message || 'Não foi possível carregar os funcionários.', color: 'red'}),
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
        setEmployeeFilter({...employeeFilter, genero: (newValue ? newValue : "") as GENERO});
    }, [employeeFilter]);

    const handleChangeDirection = useCallback((evt: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setEmployeeFilter({...employeeFilter, direction: (newValue ? newValue : "") as Direction});
    }, [employeeFilter]);

    const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
        setEmployeeFilter({...employeeFilter, page: newPage - 1});
    }, [employeeFilter]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {~
        event.preventDefault();
        queryPaginationEmployee.refetch();
    }, [queryPaginationEmployee]);

    const handleReset = useCallback((event: React.FormEvent<HTMLButtonElement>) => {~
        event.preventDefault();
        setEmployeeFilter({...employeeFilter, page: 0, nome: "", genero: "" as GENERO, dataNascimento: "", email: "", pais: "", orderBy: "nome", direction: Direction.ASC})
    }, [employeeFilter]);

    const handleDelete = useCallback((funcionario: Funcionario, setLoading: (loading: boolean) => void) => {
        setLoading(true);
        funcionarioService.delete(funcionario.id).then((response) => {
            queryPaginationEmployee.refetch();
            notifications.show({title: 'Funcionários', message: `Funcionário ${funcionario.nome} excluido com sucesso!!!`, color: 'green'})
        }).catch((error) => {
            console.log("ERROR: ", error);
            notifications.show({title: 'Exclusão de Funcionário', message: error?.response?.data?.message || `Não foi possível excluir o/a funcionário/a ${funcionario.nome}.`, color: 'red'});
        }).finally(function() {
            setLoading(false);
        });
    }, [queryPaginationEmployee]);

    useEffect(() => {
        toolsManager.scrollTop();
        queryPaginationEmployee.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeFilter.page, employeeFilter.genero, employeeFilter.orderBy, employeeFilter.direction])
    

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Stack direction="row" sx={{justifyContent: "space-between", flexWrap: "wrap"}}>
                    <Typography variant="h2">Funcionários ({queryCountEmployee.data?.data})</Typography>
                    <Button LinkComponent={Link} href="/employees/new" color="primary" disableElevation variant="contained" startIcon={<IconPlus style={iconStyles}/>} sx={{color: "#fff"}}>Novo</Button>
                </Stack>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <Paper elevation={0} sx={{p: 2}}>
                <Stack spacing={2} component="form" onSubmit={handleSubmit} >
                    <Stack direction="row" sx={{gap: 2, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}>
                        <TextField onChange={(evt) => setEmployeeFilter({...employeeFilter, nome: evt.target.value})} value={employeeFilter.nome} variant="outlined" type="text" size="small" margin="normal" placeholder='Informe um nome...' InputProps={{ endAdornment: <IconUser style={iconStyles} fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="off" sx={{m: 0}}/>
                        <TextField onChange={(evt) => setEmployeeFilter({...employeeFilter, email: evt.target.value})} value={employeeFilter.email} variant="outlined" type="text" size="small" margin="normal" placeholder='Informe um email...' InputProps={{ endAdornment: <IconMessage style={iconStyles} fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="off" sx={{m: 0}}/>
                        <ToggleButtonGroup
                            exclusive
                            size="small"
                            color="primary"
                            aria-label="genero"
                            orientation="horizontal"
                            value={employeeFilter.genero}
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
                        <DatePicker label="Data de Nascimento" value={employeeFilter.dataNascimento ? dayjs(employeeFilter.dataNascimento) : undefined} maxDate={dayjs(Date.now())} views={['day', 'month', 'year']} slotProps={{textField: { size: "small", required: false}, }} onChange={(newDate) => setEmployeeFilter({...employeeFilter, dataNascimento: dayjs(newDate).format('YYYY-MM-DD')})}/>
                        <FormControl fullWidth sx={{maxWidth: 240}}>
                            <Select value={employeeFilter.pais} sx={{"& label": {color: theme => `${theme.palette.primary.contrastText}!important`}}} size="small" label="Nacionalidade" onChange={(evt: SelectChangeEvent<string>) => setEmployeeFilter({...employeeFilter, pais: evt.target.value})} MenuProps={MenuProps}>
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
                                            primary={EMPLOYEE_ORDER_BY.find(o => o.value===employeeFilter.orderBy)?.label}
                                            secondary="Dado de ordernação"
                                        />
                                    </ListItemButton>
                                </List>
                                <Menu {...bindMenu(popupState)} anchorOrigin={{vertical: "bottom", horizontal: "left"}} transformOrigin={{vertical: "top", horizontal: "left"}} slotProps={{paper: {style: {padding: 20,},},}}>
                                    {EMPLOYEE_ORDER_BY.map((orderBy) => (
                                        <MenuItem key={orderBy.value} value={orderBy.value} onClick={()=>{
                                            popupState.close();
                                            setEmployeeFilter({...employeeFilter, orderBy: orderBy.value});
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
                            value={employeeFilter.direction}
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
                        <Button type="submit" variant="contained" disableElevation startIcon={<IconFilter style={iconStyles}/>} sx={{color: "#fff"}}>Filtar ({queryPaginationEmployee.data?.data.totalElements || 0})</Button>
                    </Stack>
                </Stack>
            </Paper>
            <Grid spacing={3} container>
                {queryPaginationEmployee.data?.data.content.map(f => (
                    <Grid xs={12} sm={4} md={4} lg={3} key={f.id}>
                        <CardEmployee funcionario={f} handleDelete={funcionarioSessao.papel === Papel.ADMINISTRADOR ? handleDelete : undefined}/>
                    </Grid>
                ))}
            </Grid>
            <Stack direction="row" sx={{justifyContent: "center"}}>
                <MuiPagination disabled={queryPaginationEmployee.data?.data === undefined} page={employeeFilter.page + 1} count={queryPaginationEmployee.data?.data.totalPages || 0} onChange={handleChangePage} color="primary" sx={{"&, & *": {color: theme => `${theme.palette.primary.contrastText} !important`}}}/>
            </Stack>
        </Stack>
    )
}
