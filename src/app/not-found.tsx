"use client";

import Link from "next/link";
import Image from "next/image";
import { rem } from '@mantine/core';
import { IconLogin } from '@tabler/icons-react';
import SideLayout from "@/components/layout/SideLayout";
import { Button, CardMedia, Stack, Typography } from "@mui/material";

export default function NotFound() {
    return (
        <SideLayout>
            <Stack spacing={2} component="div" direction="column" sx={{width: "100%", padding: "1.5rem 1.5rem", position: "relative"}}>
                <Image width={70} height={90} src="/img/logo-symbol.png" alt="Logo" style={{display: "block", margin: "auto"}}/>
                <Typography variant="h6" sx={{textAlign: "center"}}>Página não encotrada!</Typography>
                <CardMedia component="img" src="/img/404-error-img.png" sx={{width: "100%", objectFit: "cover"}}/>
                <Typography variant="body2" sx={{color: "#8391a2", textAlign: "center"}} paragraph>Caso não saiba o link var para a página de login.</Typography>
                <Button LinkComponent={Link} href="/login" type="submit" variant="contained" startIcon={<IconLogin style={{width: rem(16), height: rem(16), color: "inherit"}} />} disableElevation sx={{color: "#fff"}}>Entrar</Button>
            </Stack>
        </SideLayout>
    )
}
