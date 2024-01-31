'use client';

import dayjs from 'dayjs';
import * as yup from 'yup';
import Genero from '@/model/Genero';
import { useQuery } from 'react-query';
import { LoadingButton } from '@mui/lab';
import paisService from '@/service/PaisService';
import { DatePicker } from '@mui/x-date-pickers';
import PersonIcon from '@mui/icons-material/Person';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldErrors, useForm } from 'react-hook-form';
import { notifications } from '@mantine/notifications';
import { FuncionarioUpdateDTO } from '@/model/Funcionario';
import { TransitionProps } from '@mui/material/transitions';
import funcionarioService from '@/service/FuncionarioService';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useCallback, useEffect, useId, useState } from 'react'
import { changeFuncionario, selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, Slide, Stack, TextField, Typography, alpha } from '@mui/material';

interface UpdateProfileDialogProps {
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
};

export const UpdateEmployeeSchema = yup.object({
    nome: yup.string().required('O nome do funcionário é requerido.').max(100, 'O nome do funcionário deve ter no máximo 100 caracteres.'),
    genero: yup.string().default(Genero.MASCULINO).required("O gênero do funcionário é requerido."),
    dataNascimento: yup.string().required("A data de nascimento do funcionário é requerida."),
    morada: yup.string().required("A morada do funcionário é requerida."),
    pais: yup.string().required("O pais do funcionário é requerida."),
    biografia: yup.string().required("A biografia do funcionário é requerida."),
});

interface DataForm extends FuncionarioUpdateDTO {
    pais: string,
}

export default function UpdateProfileDialog({open, handleClose}:UpdateProfileDialogProps) {
    const dispatch = useAppDispatch();
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    const query = useQuery({
        queryKey: ["contries"],
        queryFn: () =>  paisService.findAll({}),
        onError: (error: any) => notifications.show({title: 'Paises', message: error.message || 'Não foi possível carregar os paises,', color: 'red'}),
    })
    const { register, handleSubmit, formState: { defaultValues, errors }, setValue, getValues, watch } = useForm<DataForm>({
        defaultValues: {
            nome: funcionario.nome,
            genero: funcionario.genero,
            biografia: funcionario.biografia,
            morada: funcionario.dataNascimento,
            pais: funcionario.pais.id,
            dataNascimento: funcionario.dataNascimento,
        },
        resolver: yupResolver(UpdateEmployeeSchema),
    });
    
    const dataNascimento = register("dataNascimento");

    function onSubmit(data: DataForm) {
        console.log('DATA: ', data);
        const newData = {
            nome: data.nome,
            genero: data.genero,
            morada: data.morada,
            dataNascimento: data.dataNascimento,
            biografia: data.biografia,
        }

        setLoading(true);
        funcionarioService.update(funcionario.id!, data.pais, newData as FuncionarioUpdateDTO).then(response => {
            const data = response.data;
            dispatch(changeFuncionario(data));
            notifications.show({title: 'Alterar', message: `${data.nome}, os dados da sua conta foram aterados com sucesso!!!`, color: 'green'});
            handleClose();
        }).catch((error)=>{
            console.log(error);
            notifications.show({title: 'Alterar Perfil', message: error.message});
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
        handleReset();
        handleClose()
    }

    const handleReset = useCallback(() => {
        setValue('nome', funcionario.nome);
        setValue('genero', funcionario.genero);
        setValue('morada', funcionario.morada);
        setValue('biografia', funcionario.biografia);
        setValue('dataNascimento', dayjs(funcionario.dataNascimento).format('YYYY-MM-DD'));
    }, [setValue, funcionario.nome, funcionario.genero, funcionario.morada, funcionario.biografia, funcionario.dataNascimento]);
    
    useEffect(() => {
        handleReset();
    }, [handleReset, funcionario]);
    
    return (
        <Dialog component={'form'} onSubmit={handleSubmit(onSubmit, onError)} open={open} fullWidth maxWidth={'sm'} TransitionComponent={Transition} aria-describedby="alert-dialog-slide-description">
            <DialogTitle>Alterar o Perfil</DialogTitle>
            <DialogContent>
                <DialogContentText gutterBottom textAlign={'center'}>informe os novos dados para o seu perfil.</DialogContentText>
                <Stack spacing={4}>
                    <TextField {...register('nome')} label="Nome" error={!!errors.nome?.message} helperText={errors.nome?.message} placeholder='Informe o seu nome...' InputProps={{endAdornment: <PersonIcon color='action' /> }}/>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Gênero</FormLabel>
                        <RadioGroup value={watch().genero} onChange={(evt=> setValue('genero', evt.target.value as Genero))} defaultValue={defaultValues?.genero} aria-labelledby="genero" row>
                            <FormControlLabel label={Genero.MASCULINO} value={Genero.MASCULINO} control={<Radio/>} />
                            <FormControlLabel label={Genero.FEMININO} value={Genero.FEMININO}  control={<Radio/>}/>
                        </RadioGroup>
                        <FormHelperText>Selecione o seu gênero.</FormHelperText>
                    </FormControl>
                    <TextField {...register('morada')} label="Morada" error={!!errors.morada?.message} helperText={errors.morada?.message} placeholder='Informe a sua morada...' InputProps={{endAdornment: <PersonIcon color='action' /> }}/>
                    <DatePicker label="Data de Nascimento" value={dayjs(getValues().dataNascimento || null)} maxDate={dayjs(Date.now())} views={['day', 'month', 'year']} slotProps={{textField: { helperText: errors.dataNascimento?.message || 'Dia / Mes / Ano', required: dataNascimento.required, autoFocus: true, error: !!errors.dataNascimento?.message, },}} onChange={(newDate) => setValue('dataNascimento', dayjs(newDate).format('YYYY-MM-DD'))}/>
                    <FormControl fullWidth>
                        <FormLabel>Nacionalidade:</FormLabel>
                        <Select {...register('pais')} fullWidth labelId="demo-multiple-name-label" id="demo-multiple-name" input={<OutlinedInput label="Name" />} MenuProps={MenuProps} defaultValue={funcionario.pais?.id || 0} error={!!errors.pais?.message}>
                            {query.data?.data.map((pais) => (
                                <MenuItem key={pais.id} value={pais.id}>{pais.nome}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.pais?.message}</FormHelperText>
                    </FormControl>
                    <TextField {...register('biografia')} label="Biografia" error={!!errors.biografia?.message} helperText={'Descreva em poucas palavras quem é você.'} placeholder='Informe sobre você...' minRows={5} maxRows={5} multiline/>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color='error' disabled={loading} onClick={onClose} disableElevation sx={{bgcolor: theme => theme.palette.background.default, "&:hover":{bgcolor: theme => alpha(theme.palette.background.default, 0.9),}}}>Cancelar</Button>
                <LoadingButton variant="contained" type='submit' loading={loading} disableElevation sx={{color: "#fff"}}>Salvar</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
