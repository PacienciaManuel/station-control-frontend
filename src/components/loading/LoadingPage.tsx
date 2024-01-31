"use client";

import Image from "next/image";
import { LinearProgress, Stack, Typography, linearProgressClasses, styled } from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.primary.main,
    },
}));

export default function LoadingPage() {
    return (
        <Stack spacing={2} component="div" direction="column" sx={{width: "100%", padding: "1.5rem 1.5rem", position: "relative"}}>
            <Image width={70} height={90} src="/img/logo-symbol.png" alt="Logo" style={{display: "block", margin: "auto"}}/>
            <Typography variant="body2" sx={{color: "#8391a2", textAlign: "center"}} paragraph>Carregando...</Typography>
            <BorderLinearProgress variant="indeterminate" />
        </Stack>
    )
}
