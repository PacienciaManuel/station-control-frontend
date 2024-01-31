"use client";

import NextLink from "next/link";
import NotificacaoFuncionario from "@/model/NotificacaoFuncionario";
import EmployeeNotificationListItem from "./EmployeeNotificationListItem";
import { Box, Button, Divider, List, Paper, Stack, Typography } from "@mui/material";

interface EmployeeNotificationsProps {
    total?: number,
    loading?: boolean,
    notifications?: NotificacaoFuncionario[]
}

export default function EmployeeNotifications({loading, total=0, notifications}:EmployeeNotificationsProps) {
    return (
        <Stack elevation={0} component={Paper} divider={<Divider orientation="horizontal" flexItem/>} sx={{p: 2, minHeight: 590}}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h6">Minhas Notificaçóes</Typography>
                <Button LinkComponent={NextLink} href="/notifications/employee" variant="text" disableElevation>Ver Todas ({total})</Button>
            </Stack>
            {notifications && notifications.length > 0 && (
                <List>
                {notifications.map((notification) => (
                    <EmployeeNotificationListItem notificacao={notification} key={notification.id} />
                ))}
                </List>
            )}
            {(!notifications || notifications.length == 0) && (
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
                    {loading ? "LOAGING" : <Typography variant="h4" sx={{color: "#b3b3b3", fontWeight: 500}}>Sem Notificaçóes</Typography>}
                </Box>
            )}
        </Stack>
    )
}