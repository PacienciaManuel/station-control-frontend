"use client";

import dayjs from 'dayjs';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import Genero, { GENERO } from '@/model/Genero';
import { useQueries, useQuery } from "react-query";
import { LoadingButton } from '@mui/lab';
import { IconInfoSquare, IconX } from '@tabler/icons-react';
import Grid from '@mui/material/Unstable_Grid2';
import paisService from '@/service/PaisService';
import { DatePicker } from '@mui/x-date-pickers';
import { IconUpload } from '@tabler/icons-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldErrors, useForm } from 'react-hook-form';
import { notifications } from "@mantine/notifications";
import { Avatar, Group, Text, rem } from '@mantine/core';
import { Dropzone, FileRejection, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconLocation, IconPhone, IconPhoto, IconUser } from '@tabler/icons-react';
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Stack, TextField, Typography } from "@mui/material";
import { SuspeitoDTO, SuspeitoUpdateDTO } from '@/model/Suspeito';
import suspeitoService from '@/service/SuspeitoService';
import { useAppSelector } from '@/redux/hooks';
import { selectFuncionario } from '@/redux/slicer/funcionarioSlicer';
import useErrorHandler from '@/hooks/useErrorHandler';

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

export const SuspectSchema = yup.object({
    nome: yup.string().required('O nome do suspeito é requerido.').max(100, 'O nome do suspeito deve ter no máximo 100 caracteres.'),
    genero: yup.string().default(GENERO.MASCULINO).required("O gênero do suspeito é requerido."),
    dataNascimento: yup.string().required("A data de nascimento do suspeito é requerida."),
    morada: yup.string().required("A morada do suspeito é requerida."),
    detido: yup.boolean().default(true).required("Deve informar se o crime esta em vigor."),
    pais: yup.string().required("O pais do suspeito é requerida.").uuid("Pais inválido."),
    bilheteIdentidade: yup.string().required("A morada do suspeito é requerida."),
    biografia: yup.string().required("A biografia do suspeito é requerida."),
});

interface DataForm extends SuspeitoUpdateDTO {
    pais: string,
}

interface UpdateSuspectPageProps {
    params: {
        id: string,
    }
}

const maxSize = 3 * 1024 ** 2;// 3 MB
const iconStyles = {width: rem(20), height: rem(20), color: "#56595e"};

export default function UpdateSuspectPage({params}:UpdateSuspectPageProps) {
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    const errorHandler = useErrorHandler("Alterar Suspeito");
    
    const [querySuspect, queryCountry] = useQueries([
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["querySuspectById"],
            queryFn: () =>  suspeitoService.findById(params.id),
            onError: (error: any) => errorHandler(error),
        },
        {
            enabled: true,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["contries"],
            queryFn: () =>  paisService.findAll({}),
            onError: (error: any) => errorHandler(error),
        }
    ]);

    const { register, handleSubmit, formState: { defaultValues, errors }, reset, setValue, getValues, watch } = useForm<DataForm>({
        defaultValues: {
            genero: GENERO.MASCULINO,
        },
        resolver: yupResolver(SuspectSchema),
    });
    
    const dataNascimento = register("dataNascimento");
    
    function onSubmit(data: DataForm) {
        const suspeitoDTO:SuspeitoUpdateDTO = {
            nome: data.nome,
            genero: data.genero,
            dataNascimento: data.dataNascimento,
            detido: data.detido,
            morada: data.morada,
            biografia: data.biografia,
            bilheteIdentidade: data.bilheteIdentidade,
        };
        setLoading(true);
        suspeitoService.update(querySuspect.data!.data.id, data.pais, suspeitoDTO).then(response => {
            reset();
            const data = response.data;
            notifications.show({title: 'Suspeito', message: `Os dados do suspeito ${data.nome} foram alterados com sucesso!!!`, color: 'green'});
        }).catch(errorHandler).finally(function(){
            setLoading(false);
        });
    }

    function onError(errors: FieldErrors<FormData>) {
        for (const [key, value] of Object.entries(errors)) {
            notifications.show({
                color: 'red',
                title: 'Novo Suspeito',
                message: value.message,
            });
        }
    }

    useEffect(() => {
        setValue("nome", querySuspect.data?.data.nome || "");
        setValue("genero", querySuspect.data?.data.genero || "");
        setValue("dataNascimento", querySuspect.data?.data.dataNascimento ? dayjs(querySuspect.data?.data.dataNascimento).format('YYYY-MM-DD') : "");
        setValue("morada", querySuspect.data?.data.morada || "");
        setValue("detido", querySuspect.data?.data.detido || false);
        setValue("pais", querySuspect.data?.data.pais.id || "");
        setValue("bilheteIdentidade", querySuspect.data?.data.bilheteIdentidade || "");
        setValue("biografia", querySuspect.data?.data.biografia || "");
    }, [setValue, querySuspect.data])
    

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Alterar Suspeito</Typography>
                <Divider orientation="horizontal" flexItem sx={{mt: 1}}/>
            </Box>
            <Paper elevation={0} component="form" onSubmit={handleSubmit(onSubmit, onError)}>
                <Box sx={{p: 2}}>
                    <Grid spacing={3} container>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Nome:</FormLabel>
                                <TextField {...register('nome')} variant="outlined" size="small" error={!!errors.nome?.message} helperText={errors.nome?.message} placeholder='Informe o nome do funcionario...' fullWidth InputProps={{endAdornment: <IconUser style={iconStyles} /> }}/>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Bilhete de Identidade:</FormLabel>
                                <TextField {...register('bilheteIdentidade')} variant="outlined" label="BI" size="small" error={!!errors.bilheteIdentidade?.message} helperText={errors.bilheteIdentidade?.message} placeholder='Informe o BI do suspeito...' fullWidth InputProps={{endAdornment: <IconInfoSquare style={iconStyles}/> }}/>
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel id="demo-radio-buttons-group-label">Gênero: {watch().genero}</FormLabel>
                                <RadioGroup value={watch().genero} onChange={(evt=> setValue('genero', evt.target.value as Genero))} defaultValue={defaultValues?.genero} aria-labelledby="genero" row>
                                    <FormControlLabel label={Genero.MASCULINO} value={Genero.MASCULINO} control={<Radio/>} />
                                    <FormControlLabel label={Genero.FEMININO} value={Genero.FEMININO}  control={<Radio/>}/>
                                </RadioGroup>
                                <FormHelperText>Selecione o gênero do suspeito.</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel id="demo-radio-buttons-group-label">Detido:</FormLabel>
                                <FormControlLabel label="Detido" value={true}  control={<Checkbox {...register('detido')} checked={watch("detido")}/>}/>
                                <FormHelperText>Marque está opção se o suspeito estive detido.</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Data de Nascimento:</FormLabel>
                                <DatePicker label="Data de Nascimento" value={dayjs(getValues().dataNascimento || null)} maxDate={dayjs(Date.now())} views={['day', 'month', 'year']} slotProps={{textField: { helperText: errors.dataNascimento?.message, required: dataNascimento.required, autoFocus: true, error: !!errors.dataNascimento?.message, fullWidth: true, variant: "outlined", size:"small"},}} onChange={(newDate) => setValue('dataNascimento', dayjs(newDate).format('YYYY-MM-DD'))}/>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Morada:</FormLabel>
                                <TextField {...register('morada')} variant="outlined" label="Morada" size="small" error={!!errors.morada?.message} helperText={errors.morada?.message} placeholder='Informe a sua morada...' fullWidth InputProps={{endAdornment: <IconLocation style={iconStyles}/> }}/>
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Nacionalidade: {watch("pais")}</FormLabel>
                                {watch("pais") && (
                                <Select variant="outlined" {...register('pais')} value={watch("pais")} defaultValue={watch("pais") || 0} fullWidth size="small" labelId="demo-multiple-name-label" id="demo-multiple-name" input={<OutlinedInput label="Pais" />} inputProps={{}} MenuProps={MenuProps} error={!!errors.pais?.message}>
                                    {queryCountry.data?.data.map((pais) => (
                                        <MenuItem key={pais.id} value={pais.id}>{pais.nome}</MenuItem>
                                    ))}
                                </Select>
                                )}
                                <FormHelperText>{errors.pais?.message}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid xs={12}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel id="demo-radio-buttons-group-label">Biografia:</FormLabel>
                                <TextField {...register('biografia')} variant="outlined" label="Biografia" size="small" error={!!errors.biografia?.message} helperText={'Descreva em poucas palavras quem é você.'} placeholder='Informe sobre você...' minRows={12} maxRows={12} fullWidth multiline/>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <LoadingButton loading={loading} type="submit" variant="contained" size="large" fullWidth disableElevation sx={{color: "#fff", borderRadius: "0 0 5px 5px", mt: 3}}>Salvar</LoadingButton>
            </Paper>
        </Stack>
    )
}
