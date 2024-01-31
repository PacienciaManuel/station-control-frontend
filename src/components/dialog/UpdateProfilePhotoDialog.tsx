'use client';

import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { notifications } from '@mantine/notifications';
import { TransitionProps } from '@mui/material/transitions';
import funcionarioService from '@/service/FuncionarioService';
import { Avatar, Box, Group, Text, rem } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, FileRejection, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { changeFuncionario, selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';

interface UpdateProfilePhotoDialogProps {
    open: boolean,
    handleClose: () => void;
} 

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
    children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const maxSize = 3 * 1024 ** 2;// 3 MB

export default function UpdateProfilePhotoDialog({open, handleClose}:UpdateProfilePhotoDialogProps) {
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | null>();
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    
    function onDrop(files:File[]) {
        setFile(files[0]);
        console.log('accepted files', files)
    }

    function onReject(files:FileRejection[]) {
        notifications.show({title: 'Foto de Perfil', message: 'Permitido apeans arquivos de imagem.', color: 'red'});
    }

    function onClose(evt:React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        setFile(null);
        handleClose();
    }

    function handleSubmit(evt:React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        const formData = new FormData();
        formData.append('fotoPerfil', file!);
        setLoading(true);

        funcionarioService.updateProfilePhoto(funcionario.id!, formData)
        .then((response) => {
            const data = response.data;
            dispatch(changeFuncionario(data));
            notifications.show({title: 'Foto de Perfil', message: `${data.nome}, a sua foto de perfil foi alterada com sucesso!!!`, color: 'green'});
            setFile(null);
            handleClose();
        }).catch(error => {
            notifications.show({title: 'Foto de Perfil', message: error.message, color: 'red'});
        }).finally(function(){
            setLoading(false);
        })
    }
    return (
        <Dialog open={open} TransitionComponent={Transition} aria-labelledby='dialog-title' aria-describedby='dialog-description'>
            <DialogTitle id='dialog-title'>Foto de Perfil</DialogTitle>
            <DialogContent id=''>
                <DialogContentText id='dialog-description'>Tenha em mente que a foto a ser submetida deve ter um tamanho máximo de até 5MB para que processo seja concluido com exito.</DialogContentText>
                
                <Dropzone loading={loading} mt={10} name='fotoPerfil' onDrop={onDrop} onReject={onReject} maxSize={maxSize} maxFiles={1} accept={IMAGE_MIME_TYPE} multiple={false}>
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5}/>
                        </Dropzone.Accept>
                        
                        <Dropzone.Reject>
                            <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5}/>
                        </Dropzone.Reject>

                        <Dropzone.Idle>
                            {
                                file ? (
                                    <Avatar size={'xl'} src={ URL.createObjectURL(file!)} />
                                ): (
                                    <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5}/>
                                )
                            }
                        </Dropzone.Idle>
                        <Box>
                            <Text size="xl" inline>Arraste a imagen aqui ou clique para selecionar</Text>
                            <Text size="sm" c="dimmed" inline mt={7}>Anexe um arquivo quiser, o arquivo não deve exceder 5mb.</Text>
                        </Box>
                    </Group>
                </Dropzone>
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} variant='contained' color='error' onClick={onClose} disableElevation>Cancelar</Button>
                <LoadingButton loading={loading} disabled={!file} onClick={handleSubmit} variant='contained' color='primary' className='btn-primary' autoFocus disableElevation sx={{color: "#fff"}}>Salvar</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
