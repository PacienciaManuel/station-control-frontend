"use client";

import { rem } from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import sessionManager from "@/util/SessionManager";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectFuncionario } from "@/redux/slicer/funcionarioSlicer";
import resourceResolver from "@/util/ResourceResolver";

interface ProfileProps {
    handleClose: () => void;
}

const iconStyle = {width: rem(19), height: rem(19)};

export default function Profile({ handleClose }:ProfileProps) {
    const router = useRouter();
    const funcionario = useAppSelector(selectFuncionario);
    
    const handleLogout = useCallback(() => {
        handleClose();
        sessionManager.clearSession();
        router.replace("/login");
    }, [router, handleClose]);

    return (
        <Stack>
            <Stack sx={{ alignItems: "center", px: 2}}>
                <Avatar src={resourceResolver.profilePhoto(funcionario.fotoPerfil)} alt={funcionario.email} sx={{width: 64, height: 64}}/>
                <Typography variant="h6" noWrap sx={{maxWidth: 230}}>{funcionario.nome}</Typography>
                <Typography variant="body1" gutterBottom noWrap sx={{maxWidth: 230}}>{funcionario.email}</Typography>
                <Divider orientation="horizontal" flexItem/>
            </Stack>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleClose} LinkComponent={Link} href="/profile">
                        <ListItemAvatar>
                            <IconUser style={iconStyle}/>
                        </ListItemAvatar>
                        <ListItemText primary="Perfil"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleClose} LinkComponent={Link} href="#">
                        <ListItemAvatar>
                            <IconSettings style={iconStyle}/>
                        </ListItemAvatar>
                        <ListItemText primary="Configurações"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemAvatar>
                            <IconLogout style={iconStyle}/>
                        </ListItemAvatar>
                        <ListItemText primary="Sair"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Stack>
    )
}