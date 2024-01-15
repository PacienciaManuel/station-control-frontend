"use client";

import { Avatar, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, alpha } from "@mui/material";

export default function Notification() {
    return (
        <Stack divider={<Divider orientation="horizontal" flexItem/>}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", px: 2}}>
                <Typography variant="h6">Notificaçóes</Typography>
                <Button variant="text" disableElevation>Limpar tudo</Button>
            </Stack>
            <List sx={{
                maxHeight: 300,
                overflowY: "auto", 
                overflowX: "hidden", 
                transition: "all .4s ease", 
                "&::-webkit-scrollbar": {
                    width: 0
                }, 
                "&:hover::-webkit-scrollbar": {
                    width: 10,
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
            {notifications.map(notification => (
                <ListItem disablePadding key={notification.src}>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar src={notification.src} alt={notification.nome} />
                        </ListItemAvatar>
                        <ListItemText primary={notification.nome} secondary={notification.data} />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
            <Button variant="text" fullWidth disableElevation>Ver Todas</Button>
        </Stack>
    )
}

const notifications = [
    {
        nome: "Manuel Isaac",
        data: "Há 2 dias",
        src: "/img/users/avatar-3.jpg",
    },
    {
        nome: "Venacio Chical",
        data: "Há 4 dias",
        src: "/img/users/avatar-4.jpg",
    },
    {
        nome: "Ator Godinho",
        data: "Há 2 horas",
        src: "/img/users/avatar-5.jpg",
    },
    {
        nome: "Filipe António",
        data: "Há 3 semanas",
        src: "/img/users/avatar-6.jpg",
    },
    {
        nome: "João Sardinha",
        data: "Há 12 dias",
        src: "/img/users/avatar-7.jpg",
    },
]