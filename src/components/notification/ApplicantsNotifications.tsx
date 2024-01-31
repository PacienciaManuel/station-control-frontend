"use client";

import NextLink from "next/link";
import NotificacaoRequerente from "@/model/NotificacaoRequerente";
import ApplicantNotificationListItem from "./ApplicantNotificationListItem";
import { Box, Button, Divider, List, Paper, Stack, Typography } from "@mui/material";

interface ApplicantsNotificationsProps {
    total?: number,
    loading?: boolean,
    notifications?: NotificacaoRequerente[]
}

export default function ApplicantsNotifications({loading, total, notifications}:ApplicantsNotificationsProps) {
    return (
        <Stack elevation={0} component={Paper} divider={<Divider orientation="horizontal" flexItem/>} sx={{p: 2, minHeight: 590}}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="h6">Notificações para Requerentes</Typography>
                <Button LinkComponent={NextLink} href="/notifications/applicants" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            {notifications && notifications.length > 0 && (
                <List>
                {notifications.map((notification) => (
                    <ApplicantNotificationListItem notificacao={notification} key={notification.id} />
                ))}
                </List>
            )}
            {(!notifications || notifications.length == 0) && (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: 400,}}>
                    {loading ? "LOAGING" : <Typography variant="h4" sx={{color: "#b3b3b3", fontWeight: 500}}>Sem Notificaçóes</Typography>}
                </Box>
            )}
        </Stack>
    )
}
