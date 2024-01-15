"use client";

import * as yup from 'yup';
import Image from "next/image";
import NextLink from "next/link";
import Login from '@/model/Login';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { LoadingOverlay } from '@mantine/core';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import loginService from '@/service/LoginService';
import sessionManager from '@/util/SessionManager';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Link, Stack, TextField, Typography } from "@mui/material";

const CadastroSchema = yup.object({
    email: yup.string().required('O email do usuário é requerido.').email('Email inválido: exemplo@gmail.com'),
    senha: yup.string().required("A senha do usuário é requerida.")
    .min(8, 'A senha do usuário deve ter no mínimo 8 caracteres.')
    .max(16, 'A senha do usuário deve ter no máximo 32 caracteres.')
});

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Login>({
        resolver: yupResolver(CadastroSchema),
    });

    const onSubmit = useCallback((login: Login) =>{
        setLoading(true);
        loginService.login(login).then(async (response) => {
        const data = response.data;
        const { data: { frontendAuthorization } } = await loginService.frontendAuthorization(data.usuario);
        notifications.show({title: "Login", message: `${data.usuario.nome}, O seu login foi efetuado com sucesso...`, color: "green"});
        sessionManager.session({apiAccessToken: data.acesso, apiRefreshToken: data.atualizacao, apiTokenType: data.tipo, frontendAuthorization });
    }).catch((error) => {
        setValue("senha", ""),
        console.log("ERROR: ", error);
        notifications.show({color: "red", title: 'Login', message: error?.message});
    }).finally(function () {
        setLoading(false);
    });
}, [setValue]);

    return (
        <Stack direction="row" sx={{height: "100vh"}}>
            <Stack sx={{justifyContent: "space-between", width: "100%", maxWidth: {xs: "100%", md: 480}, padding: "3rem 2rem", bgcolor: "#f0f8ff",}}>
                <Box sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Stack spacing={2} component="div" direction="column" sx={{width: "100%", padding: "1.5rem 1.5rem", position: "relative"}}>
                        <LoadingOverlay 
                            zIndex={1000}
                            visible={loading} 
                            transitionProps={{duration: 1000}} 
                            loaderProps={{ color: '#727cf5', type: 'bars' }}
                            overlayProps={{ radius: 'sm', blur: 0.2, bg: '#00000019' }}
                        />
                        <Image width={70} height={90} src="/img/logo-symbol.png" alt="Logo" style={{display: "block", margin: "auto"}}/>
                        <Typography variant="h6" sx={{textAlign: "center"}}>Login</Typography>
                        <Typography variant="body2" sx={{color: "#8391a2", textAlign: "center"}} paragraph>Entra com teu endereço de email e senha para acede o painel de administração.</Typography>
                        <Stack onSubmit={handleSubmit(onSubmit)} component="form" spacing={2} direction="column" width="100%" mt={4}>
                            <FormControl>
                                <FormLabel sx={{fontWeight: 500}}>Email:</FormLabel>
                                <TextField variant="outlined" type="email" size="small" margin="normal" {...register('email')} error={!!errors.email?.message} helperText={errors.email?.message} placeholder='Informe o seu email...' InputProps={{ endAdornment: <EmailIcon fontSize="small" color="action"/>, style: {color: "secondary"}}} autoComplete="email" fullWidth/>
                            </FormControl>
                            <FormControl>
                                <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                                    <FormLabel sx={{fontWeight: 500}}>Senha:</FormLabel>
                                    <Link component={NextLink} href="#" variant="body2">Esqueceu sua senha?</Link>
                                </Stack>
                                <TextField variant="outlined" type={showPassword ? "text" : "password"} size="small" margin="normal" {...register('senha')} error={!!errors.senha?.message} helperText={errors.senha?.message} placeholder='Informe a sua senha...' InputProps={{ endAdornment: <Checkbox onChange={(evt)=> setShowPassword(evt.target.checked)} icon={<VisibilityOffIcon color="action" />} checkedIcon={<VisibilityIcon color="action"/>} />, style: {color: "secondary"}}} InputLabelProps={{style: {color: "#184a84"}}} autoComplete="current-password" fullWidth/>
                            </FormControl>
                            <FormControlLabel label="Lembre de mim" control={<Checkbox value="remember"/>}/>
                            <Button type="submit" variant="contained" startIcon={<LoginIcon />} disableElevation>Entrar</Button>
                        </Stack>
                    </Stack>
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
