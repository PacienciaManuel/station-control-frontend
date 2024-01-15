"use client";

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { Avatar, Badge, Button, Drawer, InputBase, Menu, MenuItem, Stack, useMediaQuery } from '@mui/material';
import { useId, useState } from 'react';
import Sidebar from './Sidebar';
import { IconBell, IconSearch, IconShieldLock } from '@tabler/icons-react';
import { Chip, rem } from '@mantine/core';
import Notification from './Notification';
import Profile from './Profile';

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
    const [open, setOpen] = useState(true);
    const matches = useMediaQuery(theme.breakpoints.up('lg'));
    // const searchTrigger = bindTrigger(searchPopupState);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', }}>
        <CssBaseline />
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
                            marginRight: 5,
                                ...(open && matches && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Stack 
                            direction="row"
                            component="form"
                        >
                            <PopupState variant="popover" popupId={searchPopupId}>
                                {(popupState) => (<>
                                    <Box component="span" {...bindTrigger(popupState)}>
                                        <InputBase 
                                            required
                                            name="search"
                                            type="search" 
                                            autoComplete="off"
                                            placeholder="Procurar..." 
                                            startAdornment={<IconSearch style={{width: rem(19), height: rem(19)}}/>} 
                                            sx={{
                                                gap: 2,
                                                width: "100%",
                                                maxWidth: 300,
                                                padding: "5px 10px",
                                                bgcolor: "#464f5b",
                                                borderRadius: "5px 0 0 5px",
                                                color: theme.palette.primary.contrastText,
                                            }}
                                        />
                                    </Box>
                                    <Menu
                                        {...bindMenu(popupState)} 
                                        anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                                        transformOrigin={{vertical: "top", horizontal: "left"}}
                                        slotProps={{
                                            paper: {
                                                style: {
                                                    maxWidth: 312,
                                                    width: "100vw",
                                                },
                                            }
                                        }}
                                    >
                                    <MenuItem onClick={popupState.close}>Cake</MenuItem>
                                        <MenuItem onClick={popupState.close}>Death</MenuItem> 
                                    </Menu>
                                </>)}
                            </PopupState>
                            <Button variant="contained" disableElevation sx={{color: "#f0f8ff", borderRadius: "0 5px 5px 0",}}>Pesquisar</Button>
                        </Stack>
                    </Stack>
                    <Stack spacing={2} direction="row" sx={{alignItems: "center"}}>
                        <PopupState variant="popover" popupId={profilePopupId}>
                            {(popupState) => (<>
                                <IconButton {...bindTrigger(popupState)} >
                                    <Badge badgeContent={4} color="primary" overlap="circular">
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
                                                maxWidth: 340,
                                                width: "100vh",
                                            },
                                        }
                                    }}
                                >
                                    <Notification />
                                </Menu>
                            </>)}
                        </PopupState>
                        <Toolbar sx={{display: "flex", gap: 2, alignItems: "center", bgcolor: "#464f5b",}}>
                            <Stack sx={{alignItems: "center"}}>
                                <Typography variant="body1">Manuel Isaac</Typography>
                                <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={theme.palette.success.light} variant="light" size="xs" checked>Administrador</Chip>
                            </Stack>
                            <PopupState variant="popover" popupId={profilePopupId}>
                                {(popupState) => (<>
                                    <IconButton {...bindTrigger(popupState)} >
                                        <Avatar src={"/img/users/avatar-9.jpg"} alt={"Manuel Isaac"} />
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
                                        <Profile />
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
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
