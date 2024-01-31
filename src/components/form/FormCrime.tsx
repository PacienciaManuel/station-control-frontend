"use client";

import * as yup from 'yup';
import { useEffect } from 'react';
import { rem } from '@mantine/core';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { IconUser } from '@tabler/icons-react';
import Crime, { CrimeDTO } from '@/model/Crime';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Paper, Stack, TextField } from "@mui/material";

interface FormCrimeProps {
    crime?: Crime,
    loading: boolean,
    handleCreate?: (crimeDTO: CrimeDTO, reset: () => void) => void;
    handleUpdate?: (idCrime: string, crimeDTO: CrimeDTO, reset: () => void) => void;
}

export const CrimeSchema = yup.object({
    nome: yup.string().required('O nome do crime é requerido.').max(100, 'O nome do crime deve ter no máximo 100 caracteres.'),
    vigor: yup.boolean().default(true).required("Deve informar se o crime esta em vigor."),
    descricao: yup.string().required("A descrição do crime é requerida."),
});

const iconStyles = {width: rem(20), height: rem(20), color: "#56595e"};

export default function FormCrime({crime, loading, handleCreate, handleUpdate}:FormCrimeProps) {
    const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm<CrimeDTO>({
        defaultValues: {
            nome: crime?.nome || "",
            vigor: crime?.vigor || true,
            descricao: crime?.descricao || "",
        },
        resolver: yupResolver(CrimeSchema),
    });

    function onSubmit(data: CrimeDTO) {
        if (crime && handleUpdate) {
            return handleUpdate(crime.id, data, reset);
        }

        if (!crime && handleCreate) {
            return handleCreate(data, reset);
        }
    }

    useEffect(() => {
        setValue("nome", crime?.nome || "");
        setValue("vigor", crime?.vigor || false);
        setValue("descricao", crime?.descricao || "");
    }, [setValue, crime])
    

    return (
        <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit)} sx={{width: "100%", maxWidth: 600, mx: "auto"}}>
            <Stack sx={{p: 2, gap: 2}}>
                <FormControl fullWidth sx={{gap: 1}}>
                    <FormLabel>Nome:</FormLabel>
                    <TextField {...register('nome')} variant="outlined" size="small" error={!!errors.nome?.message} helperText={errors.nome?.message} placeholder='Informe o nome do funcionario...' fullWidth InputProps={{endAdornment: <IconUser style={iconStyles} /> }}/>
                </FormControl>
                <FormControl fullWidth sx={{gap: 1}}>
                    <FormLabel id="demo-radio-buttons-group-label">Em Vigor:</FormLabel>
                    <FormControlLabel label="Em Vigor" value={true}  control={<Checkbox {...register('vigor')} checked={watch("vigor")}/>}/>
                    <FormHelperText>Marque está opção se o crime estiver em vigor.</FormHelperText>
                </FormControl>
                <FormControl fullWidth sx={{gap: 1}}>
                    <FormLabel id="demo-radio-buttons-group-label">Descrição:</FormLabel>
                    <TextField {...register('descricao')} variant="outlined" label="Descrição" size="small" error={!!errors.descricao?.message} helperText={'Descreva em poucas palavras sobre este crime.'} placeholder='Informe sobre o crime...' minRows={10} maxRows={10} fullWidth multiline/>
                </FormControl>
            </Stack>
            <LoadingButton loading={loading} type="submit" variant="contained" size="large" fullWidth disableElevation sx={{color: "#fff", borderRadius: "0 0 4px 4px", mt: 3}}>Salvar</LoadingButton>
        </Paper>
    )
}