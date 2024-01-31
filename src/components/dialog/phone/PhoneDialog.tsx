'use client';

import * as yup from 'yup';
import { rem } from '@mantine/core';
import PhoneListItem from './PhoneListItem';
import { IconPhone } from '@tabler/icons-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldErrors, useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import telefoneService from '@/service/TelefoneService';
import Telefone, { TelefoneDTO } from '@/model/Telefone';
import { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { forwardRef, useCallback, useId, useState } from 'react';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { addPhone, removePhone, selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, List, Slide, Stack, Tab, TextField, alpha } from '@mui/material';

interface PhoneDialogProps {
    open: boolean,
    handleClose: () => void,
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
    children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const PhoneSchema = yup.object({
    numero: yup.string().required('O número de telefone do funcionário é requerido.'),
});

export default function PhoneDialog({open, handleClose}:PhoneDialogProps) {
    const phonesTabId = useId();
    const newPhoneTabId = useId();
    const dispatch = useAppDispatch();
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    const [tabContext, setTabContext] = useState<string>(phonesTabId);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<TelefoneDTO>({
        defaultValues: {
            numero: "",
        },
        resolver: yupResolver(PhoneSchema),
    });
    
    function onSubmit(data: TelefoneDTO) {
        setLoading(true);
        telefoneService.createByFuncionario(funcionario.id, data).then(response => {
            reset();
            const data = response.data;
            dispatch(addPhone(data));
            notifications.show({title: 'Novo Telefone', message: `Telefone foi salvos com sucesso!!!`, color: 'green'});
        }).catch((error)=>{
            console.log(error);
            notifications.show({title: 'Novo Telefone', message: error.message});
        }).finally(function(){
            setLoading(false);
        });
    }

    function onError(errors: FieldErrors<FormData>) {
        for (const [key, value] of Object.entries(errors)) {
            notifications.show({
                color: 'red',
                title: 'Telefone',
                message: value.message,
            });
        }
    }
    
    function onClose(evt:React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        reset();
        handleClose()
    }

    const handleDelete = useCallback((telefone: Telefone, setLoading: (loading:boolean) => void) => {
        setLoading(true);
        telefoneService.deleteByFuncionario(funcionario.id, telefone.id).then(response => {
            dispatch(removePhone(telefone));
            notifications.show({title: "Telefone", message: "Telefone exluido com sucesso.", color: "green"});
        }).catch(error => {
            console.log("ERROR", error);
            notifications.show({title: "Error", message: error.message || "Não foi possível excluir o telefone", color: "red"});
        }).finally(() => {}).finally(function() {
            setLoading(false);
        });
    }, [dispatch, funcionario.id]);

    const handleChangeTabContext = (event: React.SyntheticEvent, newValue: string) => {
        setTabContext(newValue);
    };
    
    return (
        <Dialog component={'form'} onSubmit={handleSubmit(onSubmit, onError)} open={open} fullWidth maxWidth={'sm'} TransitionComponent={Transition} aria-describedby="alert-dialog-slide-description">
            <DialogTitle>Gerênciamento de Telefones</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom textAlign={'center'}>Gerencie os seus contactos.</DialogContentText>
                <TabContext value={tabContext}>
                    <Box sx={{borderBottom: theme => `1px solid ${theme.palette.primary.contrastText}`}}>
                        <TabList centered onChange={handleChangeTabContext} aria-label="lab API tabs example">
                            <Tab label={`Telefones (${funcionario.telefones?.length || 0})`} value={phonesTabId} sx={{color: theme => theme.palette.background.default}}/>
                            <Tab label="Novo" value={newPhoneTabId} sx={{color: theme => theme.palette.background.default}}/>
                        </TabList>
                    </Box>
                    <TabPanel value={phonesTabId} sx={{px: 0, pb: 0}}>
                        <List disablePadding>
                            {funcionario.telefones?.map(telefone => (
                                <PhoneListItem telefone={telefone} handleDelete={handleDelete} key={telefone.id}/>
                            ))}
                        </List>
                    </TabPanel>
                    <TabPanel value={newPhoneTabId} sx={{px: 0, pb: 0}}>
                        <Stack spacing={4}>
                            <FormControl fullWidth>
                                <FormLabel>Título:</FormLabel>
                                <TextField {...register('numero')} label="Número" margin="normal" error={!!errors.numero?.message} helperText={errors.numero?.message} placeholder='Informe o número...' InputProps={{endAdornment: <IconPhone style={{width: rem(20), height: rem(20)}}/> }}/>
                            </FormControl>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color='error' disabled={loading} onClick={onClose} disableElevation sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Sair</Button>
                {tabContext === newPhoneTabId && (
                    <LoadingButton variant="contained" type='submit' loading={loading} disableElevation sx={{color: "#fff"}}>Salvar</LoadingButton>
                )}
            </DialogActions>
        </Dialog>
    )
}
