"use client";

import timeAgoManager from "@/util/TimeAgoManager";
import resourceResolver from "@/util/ResourceResolver";
import NotificacaoFuncionario from "@/model/NotificacaoFuncionario";
import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography, alpha } from "@mui/material";
import Link from "next/link";

interface NotificationProps {
    total?: number,
    handleClose: () => void,
    notifications?: NotificacaoFuncionario[],
}

export default function Notification({notifications, handleClose, total=0}:NotificationProps) {
    return (
        <Stack divider={<Divider orientation="horizontal" flexItem/>}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", px: 2}}>
                <Typography variant="h6">Notificaçóes {notifications?.length} </Typography>
                <Button variant="text" disableElevation>Limpar tudo</Button>
            </Stack>
            <List sx={{
                maxHeight: 300,
                overflowY: "auto", 
                overflowX: "hidden", 
                transition: "all .4s ease", 
                "&::-webkit-scrollbar": {
                    width: 0,
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
            {notifications?.map(notification => (
                <ListItem secondaryAction={
                    <Typography variant="body2">{timeAgoManager.timeago(notification.dataNotificacao)}</Typography>
                } disablePadding key={notification.id} sx={{bgcolor: theme => !notification.visto ? alpha(theme.palette.primary.main, 0.1) : "none"}}>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar src={resourceResolver.profilePhoto(notification.funcionario.fotoPerfil)} alt={notification.funcionario.nome} />
                        </ListItemAvatar>
                        <ListItemText 
                            primary={<span><b>{notification.funcionario.nome}</b> - {notification.titulo}</span>} 
                            secondary={notification.descricao} 
                            primaryTypographyProps={{maxWidth: 200, noWrap: true}}
                            secondaryTypographyProps={{maxWidth: 200, noWrap: true}}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
            </List>
            <Button onClick={handleClose} LinkComponent={Link} href="/notifications/employee" variant="text" fullWidth disableElevation>Ver Todas ({total})</Button>
        </Stack>
    )
}