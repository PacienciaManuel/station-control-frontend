"use client";

import { useId } from "react";
import NextLink from "next/link";
import { Text } from "@mantine/core";
import timeAgoManager from "@/util/TimeAgoManager";
import { bindHover } from "material-ui-popup-state";
import ApplicantHover from "../popup/ApplicantHover";
import NotificacaoRequerente from "@/model/NotificacaoRequerente";
import { Avatar, Link, ListItem, ListItemAvatar, ListItemText, Stack, Typography, alpha } from "@mui/material";
import toolsManager from "@/util/ToolsManager";

interface ApplicantNotificationListItemProps {
    notificacao: NotificacaoRequerente
}

export default function ApplicantNotificationListItem({notificacao}:ApplicantNotificationListItemProps) {
    const popoverId = useId();
    
    return (
        <ListItem disablePadding>
            <ListItemAvatar>
                <Avatar alt={notificacao.requerente.nome} sx={{color: "#fff", backgroundColor: toolsManager.generateColor(notificacao.requerente.nome)}}>{notificacao.requerente.nome.charAt(0).toUpperCase()} </Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={
                    <Stack component="span" spacing={1} direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                        <ApplicantHover requerente={notificacao.requerente} anchorOrigin={{vertical: 'top', horizontal: 'left',}} transformOrigin={{vertical: 'bottom', horizontal: 'left',}}>
                            {(popupState) => (<Link {...bindHover(popupState)} component={NextLink} href={`/profile/${notificacao.requerente.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{notificacao.requerente.nome}</Link>)}
                        </ApplicantHover>
                        <Typography variant="body2">{timeAgoManager.timeago(notificacao.dataNotificacao)}</Typography>
                    </Stack>
                }
                secondary={<Text style={{fontSize: "inherit", fontWeight: "inherit", color: "inherit"}} lineClamp={2}>{notificacao.descricao}</Text> }
                primaryTypographyProps={{
                    fontWeight: "bold",
                }}
                secondaryTypographyProps={{
                    p: 2,
                    borderRadius: 2,
                    variant: "body2",
                    bgcolor: theme => alpha(theme.palette.background.default, 0.05),
                    
                }} 
            />
        </ListItem>
    )
}
