"use client";

import NextLink from "next/link";
import { Text } from "@mantine/core";
import toolsManager from "@/util/ToolsManager";
import timeAgoManager from "@/util/TimeAgoManager";
import { bindHover } from "material-ui-popup-state";
import resourceResolver from "@/util/ResourceResolver";
import EmployeeHover from "../popup/EmployeeHover";
import NotificacaoFuncionario from "@/model/NotificacaoFuncionario";
import { Avatar, Link, ListItem, ListItemAvatar, ListItemText, Stack, Typography, alpha } from "@mui/material";

interface EmployeeNotificationListItemProps {
    notificacao: NotificacaoFuncionario
}

export default function EmployeeNotificationListItem({notificacao}:EmployeeNotificationListItemProps) {
    return (
        <ListItem disablePadding>
            <ListItemAvatar>
                <Avatar src={resourceResolver.profilePhoto(notificacao.funcionario.fotoPerfil)} alt={notificacao.funcionario.nome} sx={{color: "#fff", backgroundColor: toolsManager.generateColor(notificacao.funcionario.nome)}}>{notificacao.funcionario.nome.charAt(0).toUpperCase()} </Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={
                    <Stack component="span" spacing={1} direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                        <EmployeeHover funcionario={notificacao.funcionario} anchorOrigin={{vertical: 'top', horizontal: 'left',}} transformOrigin={{vertical: 'bottom', horizontal: 'left',}}>
                            {(popupState) => (<Link {...bindHover(popupState)} component={NextLink} href={`/profile/${notificacao.funcionario.id}`} sx={{color: "#3c4c6d", textDecoration: "none", "&:hover":{color: theme => theme.palette.primary.main,textDecoration: "underline",}}}>{notificacao.funcionario.nome}</Link>)}
                        </EmployeeHover>
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
