"use client";

import * as yup from 'yup';
import Image from "next/image";
import NextLink from "next/link";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { IconSend2 } from '@tabler/icons-react';
import EmailIcon from '@mui/icons-material/Email';
import { LoadingOverlay, rem } from '@mantine/core';
import { yupResolver } from '@hookform/resolvers/yup';
import SideLayout from '@/components/layout/SideLayout';
import { Box, Button, FormControl, FormLabel, Link, Stack, TextField, Typography } from "@mui/material";

interface DataForm {
    email: string,
}

const EmailSchema = yup.object({
    email: yup.string().required('O email do usuário é requerido.').email('Email inválido: exemplo@gmail.com'),
});

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<DataForm>({
        resolver: yupResolver(EmailSchema),
    });

    const onSubmit = useCallback((data: DataForm) =>{
        setLoading(true);
        console.log("SEND: ", data)
        setTimeout(() => {
            router.replace("/login");
        }, 5000);
    }, [router]);

    return (
        <SideLayout>
            <Stack spacing={2} component="div" direction="column" sx={{width: "100%", padding: "1.5rem 1.5rem", position: "relative"}}>
                <LoadingOverlay 
                    zIndex={1000}
                    visible={loading} 
                    transitionProps={{duration: 1000}} 
                    loaderProps={{ color: '#727cf5', type: 'bars' }}
                    overlayProps={{ radius: 'sm', blur: 0.2, bg: '#00000019' }}
                />
                <Image width={70} height={90} src="/img/logo-symbol.png" alt="Logo" style={{display: "block", margin: "auto"}}/>
                <Typography variant="h6" sx={{textAlign: "center"}}>Recuperação da Conta</Typography>
                <Typography variant="body2" sx={{color: "#8391a2", textAlign: "center"}} paragraph>Enforme o seu email vinculado a conta.</Typography>
                <Stack onSubmit={handleSubmit(onSubmit)} component="form" spacing={2} direction="column" width="100%" mt={4}>
                    <FormControl>
                        <FormLabel sx={{fontWeight: 500}}>Email:</FormLabel>
                        <TextField variant="outlined" type="email" size="small" margin="normal" {...register('email')} error={!!errors.email?.message} helperText={errors.email?.message} placeholder='Informe o seu email...' InputProps={{ endAdornment: <EmailIcon fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="email" fullWidth/>
                    </FormControl>
                    <Button type="submit" variant="contained" startIcon={<IconSend2 style={{width: rem(16), height: rem(16), color: "inherit"}} />} disableElevation sx={{color: "#fff"}}>Enviar</Button>
                </Stack>
                <Box>
                    <Link component={NextLink} href="/login" variant="body2">Lembrou da senha?</Link>
                </Box>
            </Stack>
        </SideLayout>
    )
}
