"use client";

import * as yup from 'yup';
import Image from "next/image";
import NextLink from "next/link";
import Login from '@/model/Login';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { LoadingOverlay } from '@mantine/core';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import loginService from '@/service/LoginService';
import sessionManager from '@/util/SessionManager';
import { yupResolver } from '@hookform/resolvers/yup';
import { notifications } from '@mantine/notifications';
import SideLayout from '@/components/layout/SideLayout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { changeFuncionario } from '@/redux/slicer/funcionarioSlicer';
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Link, Stack, TextField, Typography } from "@mui/material";
import LoadingPage from '@/components/loading/LoadingPage';
import useErrorHandler from '@/hooks/useErrorHandler';

const CadastroSchema = yup.object({
    email: yup.string().required('O email do usuário é requerido.')
    .email('Email inválido: exemplo@gmail.com'),
    senha: yup.string().required("A senha do usuário é requerida.")
    .min(8, 'A senha do usuário deve ter no mínimo 8 caracteres.')
    .max(16, 'A senha do usuário deve ter no máximo 32 caracteres.')
});

export default function Login() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const errorHandler = useErrorHandler("Login");
    const [logged, setLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Login>({
        resolver: yupResolver(CadastroSchema),
    });

    const onSubmit = useCallback((login: Login) =>{
        setLoading(true);
        loginService.login(login).then(async (response) => {
            setLogged(true);
            const data = response.data;
            const { data: { frontendAuthorization } } = await loginService.frontendAuthorization(data);
            notifications.show({title: "Login", message: `${data.funcionario.nome}, O seu login foi efetuado com sucesso...`, color: "green"});
            sessionManager.session({apiAccessToken: data.acesso, apiRefreshToken: data.atualizacao, apiTokenType: data.tipo, frontendAuthorization });
            dispatch(changeFuncionario(data.funcionario));
            router.replace("/");
        }).catch((error) => {
            setValue("senha", "");
            errorHandler(error);
        }).finally(function () {
            setLoading(false);
        });
    }, [dispatch, errorHandler, setValue, router]);

    return (
        <SideLayout>
            {logged ? <LoadingPage /> : (
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
                                <Link component={NextLink} href="/forgot-password" variant="body2">Esqueceu sua senha?</Link>
                            </Stack>
                            <TextField variant="outlined" type={showPassword ? "text" : "password"} size="small" margin="normal" {...register('senha')} error={!!errors.senha?.message} helperText={errors.senha?.message} placeholder='Informe a sua senha...' InputProps={{ endAdornment: <Checkbox onChange={(evt)=> setShowPassword(evt.target.checked)} icon={<VisibilityOffIcon color="action" />} checkedIcon={<VisibilityIcon color="action"/>} />, style: {color: "secondary"}}} InputLabelProps={{style: {color: "#184a84"}}} autoComplete="current-password" fullWidth/>
                        </FormControl>
                        <FormControlLabel label="Lembre de mim" control={<Checkbox value="remember"/>}/>
                        <Button type="submit" variant="contained" startIcon={<LoginIcon />} disableElevation sx={{color: "#fff"}}>Entrar</Button>
                    </Stack>
                </Stack>
            )}
        </SideLayout>
    )
}
