"use client"

import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Box, Link, Stack, Typography } from "@mui/material";

interface SideLayoutProps {
    children: any,
}

export default function SideLayout({children}:SideLayoutProps) {
    return (
        <Stack direction="row" sx={{height: "100vh"}}>
            <Stack sx={{justifyContent: "space-between", width: "100%", maxWidth: {xs: "100%", md: 480}, padding: "3rem 2rem", bgcolor: "#f0f8ff",}}>
                <Box sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {children}
                </Box>
                <Typography variant="body2" sx={{color: "secondary", justifySelf: "flex-start", }} align="center" mt={4}>Copyright © <Link color="inherit" href="#">ManuelDesign</Link>{' '}{new Date().getFullYear()}.</Typography>
            </Stack>
            <Stack spacing={4} sx={{display: {xs: "none", md: "flex"}, background: "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url(/img/bg-auth.jpg), no-repeat center", backgroundSize: "cover", flexGrow: 1, justifyContent: "flex-end", alignItems: "center", px: {xs: 1, sm: 2}, py: 8, bgcolor: "#2a354c"}}>
                <Typography variant="h4" sx={{color: "white", fontWeight: 700}}>Eu amo o controle!</Typography>
                <Typography variant="body1" sx={{color: "white"}}><FormatQuoteIcon />A Segurança será sempre uma prioridade em nosso País!.<FormatQuoteIcon /></Typography>
                <Typography variant="body1" sx={{color: "white"}}>Administrador</Typography>
            </Stack>
        </Stack>
    )
}
