"use client";

import { rem } from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";

const iconStyle = {width: rem(19), height: rem(19)};

export default function Profile() {
    return (
        <Stack>
            <Stack sx={{ alignItems: "center", px: 2}}>
                <Avatar src={"/img/users/avatar-9.jpg"} alt={"Manuel Isaac"} sx={{width: 64, height: 64}}/>
                <Typography variant="h6" noWrap sx={{maxWidth: 230}}>Manuel Isaac</Typography>
                <Typography variant="body1" gutterBottom noWrap sx={{maxWidth: 230}}>manuelisaacialberto@gmail.com</Typography>
                <Divider orientation="horizontal" flexItem/>
            </Stack>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <IconUser style={iconStyle}/>
                        </ListItemAvatar>
                        <ListItemText primary="Perfil"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <IconSettings style={iconStyle}/>
                        </ListItemAvatar>
                        <ListItemText primary="Configurações"/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
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