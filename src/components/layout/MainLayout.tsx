"use client";

import Search from './Search';
import Sidebar from './Sidebar';
import Profile from './Profile';
import { useId, useState } from 'react';
import { Chip, rem } from '@mantine/core';
import Notification from './Notification';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { IconBell, IconSearch, IconShieldLock } from '@tabler/icons-react';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Avatar, Badge, Box, CSSObject, Drawer, IconButton, Menu, Stack, Theme, Toolbar, Typography, styled, useMediaQuery, useTheme } from '@mui/material';
import { selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import resourceResolver from '@/util/ResourceResolver';
import notificacaoFuncionarioService from '@/service/NotificacaoFuncionarioService';
import { notifications } from '@mantine/notifications';
import { useQueries } from 'react-query';
import Papel from '@/model/Papel';
import { AxiosResponse } from 'axios';
import { changeTotalNotifications } from '@/redux/slicer/totalsSlicer';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open', })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MainLayout({ children }: {children: React.ReactNode}) {
    const theme = useTheme();
    const searchPopupId = useId();
    const profilePopupId = useId();
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(true);
    const funcionario = useAppSelector(selectFuncionario);
    const matches = useMediaQuery(theme.breakpoints.up('lg'));
    const matchesUpDOWN = useMediaQuery(theme.breakpoints.down('md'));
    const queries = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            queryKey: ['countNotificationsNotSeen'],
            queryFn: () =>  notificacaoFuncionarioService.count({funcionarioDestino: funcionario.id, visto: "false"}),
            onSuccess: (data: AxiosResponse<number>) => dispatch(changeTotalNotifications(data.data)),
            onError: (error: any) => notifications.show({title: 'Notificações', message: error.message || 'Não foi possível carregar o total de notificações não vistas.', color: 'red'}),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            queryKey: ['myNotifications'],
            queryFn: () =>  notificacaoFuncionarioService.pagination({page: 0, size: 10, funcionarioDestino: funcionario.id}),
            onError: (error: any) => notifications.show({title: 'Minhas Notificações', message: error.message || 'Não foi possível carregar as tuas notificações.', color: 'red'}),
        },
    ]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: "100vh"}}>
        <Box sx={{background: theme.palette.background.default}}>
            <AppBar elevation={0} position="fixed" color="transparent" open={open && matches}>
                <Toolbar component={Stack} direction="row" sx={{justifyContent: "space-between", alignItems: "center", pr: "0 !important", bgcolor: theme.palette.background.default}}>
                    <Stack direction="row"  sx={{alignItems: "center"}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                ...(open && matches && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box component="span" sx={{display: {xs: "none", md: "inline-block"}}}>
                            <Search />
                        </Box>
                        <PopupState variant="popover" popupId={searchPopupId}>
                        {(popupState) => (<>
                            <IconButton {...bindTrigger(popupState)} sx={{display: {xs: "flex", md: "none"}, color: theme => theme.palette.primary.contrastText}}>
                                <IconSearch style={{width: rem(24), height: rem(24)}}/>
                            </IconButton>
                            {matchesUpDOWN && (
                            <Menu
                                {...bindMenu(popupState)} 
                                anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                                transformOrigin={{vertical: "top", horizontal: "left"}}
                                slotProps={{
                                    paper: {
                                        style: {
                                            padding: 0,
                                            backgroundColor: "transparent",
                                        },
                                    },
                                    root: {
                                        style: {
                                            padding: 0,
                                        }
                                    }
                                }}
                                sx={{"& > * > *": {padding: 0, borderRadius: 20}}}
                            >
                                <Search />
                            </Menu>
                            )}
                        </>)}
                    </PopupState>
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{alignItems: "center"}}>
                        <PopupState variant="popover" popupId={profilePopupId}>
                            {(popupState) => (<>
                                <IconButton {...bindTrigger(popupState)}>
                                    <Badge badgeContent={queries[0].data?.data || 0} color="primary" overlap="circular" sx={{"& > *": {color: "#fff", fontSize: rem(11)}}}>
                                        <IconBell style={{width: rem(24), height: rem(24), color: theme.palette.primary.contrastText}}/>
                                    </Badge>
                                </IconButton>
                                <Menu
                                    {...bindMenu(popupState)} 
                                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                                    transformOrigin={{vertical: "top", horizontal: "center"}}
                                    slotProps={{
                                        paper: {
                                            style: {
                                                maxWidth: 360,
                                                width: "100vh",
                                            },
                                        }
                                    }}
                                >
                                    <Notification handleClose={popupState.close} notifications={queries[1].data?.data.content} total={queries[1].data?.data.totalElements}/>
                                </Menu>
                            </>)}
                        </PopupState>
                        <Toolbar sx={{display: "flex", gap: 2, alignItems: "center", bgcolor: "#464f5b",}}>
                            <Stack sx={{alignItems: "center"}}>
                                <Typography variant="body1">{funcionario.nome}</Typography>
                                <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={funcionario.papel === Papel.ADMINISTRADOR ? "orange" : "green"} variant="light" size="xs" checked>{funcionario.papel}</Chip>
                            </Stack>
                            <PopupState variant="popover" popupId={profilePopupId}>
                                {(popupState) => (<>
                                    <IconButton {...bindTrigger(popupState)} >
                                        <Avatar src={resourceResolver.profilePhoto(funcionario.fotoPerfil)} alt={funcionario.nome} />
                                    </IconButton>
                                    <Menu
                                        {...bindMenu(popupState)} 
                                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                                        transformOrigin={{vertical: "top", horizontal: "right"}}
                                        slotProps={{
                                            paper: {
                                                style: {
                                                    maxWidth: 260,
                                                    width: "100vh",
                                                },
                                            }
                                        }}
                                    >
                                        <Profile handleClose={popupState.close} />
                                    </Menu>
                                </>)}
                            </PopupState>
                        </Toolbar>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
        { matches ? (
            <CustomDrawer variant="permanent" anchor="left" onClose={() => setOpen(false)} open={open} sx={{bgcolor: theme.palette.background.default}}>
                <Sidebar open={open} matches={matches} handleClose={handleDrawerClose} />
            </CustomDrawer>
        ) : (
            <Drawer
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
                sx={{zIndex: 2000}}
            >
                <Box sx={{width: drawerWidth}}>
                    <Sidebar open={true} matches={true} handleClose={handleDrawerClose} />
                </Box>
            </Drawer>
        )}
            <Box component="main" sx={{flexGrow: 1, width: {xs: "100vw", lg: `calc(100vw - ${open ? drawerWidth : 64}px)` }, p: 3}}>
                <DrawerHeader />
                {children}
                <Typography variant="body2" sx={{mt: 2, textAlign: "center"}}>Todos os direitos estão resevados - StationControl&copy;</Typography>
            </Box>
        </Box>
    );
}
