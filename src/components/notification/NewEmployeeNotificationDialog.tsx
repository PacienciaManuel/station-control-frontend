'use client';

import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { forwardRef, useState } from 'react';
import Funcionario from '@/model/Funcionario';
import TitleIcon from '@mui/icons-material/Title';
import { NotificacaoDTO } from '@/model/Notificacao';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldErrors, useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { TransitionProps } from '@mui/material/transitions';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import notificacaoFuncionarioService from '@/service/NotificacaoFuncionarioService';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, Slide, Stack, TextField, Typography, alpha } from '@mui/material';

interface NewEmployeeNotificationDialog {
    open: boolean,
    handleClose: () => void,
    handleRefresh: () => void,
    funcionarioOrigem: Funcionario,
    funcionarioDestino?: Funcionario,
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
    children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const NotificationSchema = yup.object({
    titulo: yup.string().required('O título da notificação é requerido.').max(100, 'O nome do notificação deve ter no máximo 100 caracteres.'),
    descricao: yup.string().required("A descrição da notificação é requerida."),
});

export default function NewEmployeeNotificationDialog({open, funcionarioOrigem, funcionarioDestino, handleClose, handleRefresh}:NewEmployeeNotificationDialog) {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { defaultValues, errors }, reset, setValue, getValues, watch } = useForm<NotificacaoDTO>({
        defaultValues: {
            titulo: "",
            descricao: "",
        },
        resolver: yupResolver(NotificationSchema),
    });

    function onSubmit(data: NotificacaoDTO) {
        setLoading(true);
        notificacaoFuncionarioService.create(funcionarioOrigem!.id, funcionarioDestino!.id, data).then(response => {
            reset();
            const data = response.data;
            notifications.show({title: 'Notificação', message: `A notificação para o/a funcionário/a ${data.funcionarioDestino.nome} foi enviada com sucesso!!!`, color: 'green'});
            handleClose();
            handleRefresh();
        }).catch((error)=>{
            console.log(error);
            notifications.show({title: 'Notificação', message: error.message});
        }).finally(function(){
            setLoading(false);
        });
    }

    function onError(errors: FieldErrors<FormData>) {
        for (const [key, value] of Object.entries(errors)) {
            notifications.show({
                color: 'blue',
                title: 'Alterar Perfil',
                message: value.message,
            });
        }
    }
    
    function onClose(evt:React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        reset();
        handleClose()
    }

    return (
        <Dialog component={'form'} onSubmit={handleSubmit(onSubmit, onError)} open={open} fullWidth maxWidth={'sm'} TransitionComponent={Transition} aria-describedby="alert-dialog-slide-description">
            <DialogTitle>Notificação</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom textAlign={'center'}>informe os dados para a notificação.</DialogContentText>
                <Stack spacing={4}>
                    <FormControl fullWidth>
                        <FormLabel>Título:</FormLabel>
                        <TextField {...register('titulo')} label="Título" margin="normal" error={!!errors.titulo?.message} helperText={errors.titulo?.message} placeholder='Informe o título...' InputProps={{endAdornment: <TitleIcon color='action' fontSize="small"/> }}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <FormLabel>Descricao:</FormLabel>
                        <TextField {...register('descricao')} label="Descrição" margin="normal" error={!!errors.descricao?.message} helperText={'Descreva em poucas palavras a descrição da notificação.'} placeholder='Informe sobre a notificação...' InputProps={{endAdornment: <DescriptionOutlinedIcon color='action' fontSize="small"/>}} minRows={5} maxRows={5} multiline/>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color='error' disabled={loading} onClick={onClose} disableElevation sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Cancelar</Button>
                <LoadingButton variant="contained" type='submit' loading={loading} disableElevation sx={{color: "#fff"}}>Enviar</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
