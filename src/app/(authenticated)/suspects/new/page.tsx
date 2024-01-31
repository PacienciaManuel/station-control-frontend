"use client";

import dayjs from 'dayjs';
import * as yup from 'yup';
import { useState } from 'react';
import Genero, { GENERO } from '@/model/Genero';
import { useQuery } from "react-query";
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
import { SuspeitoDTO } from '@/model/Suspeito';
import suspeitoService from '@/service/SuspeitoService';
import { useAppSelector } from '@/redux/hooks';
import { selectFuncionario } from '@/redux/slicer/funcionarioSlicer';

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
    foto: yup.mixed(),
    numero: yup.string().required('O número de telefone do suspeito é requerido.'),
    biografia: yup.string().required("A biografia do suspeito é requerida."),
});

interface DataForm extends SuspeitoDTO {
    pais: string,
    foto?: File,
}

const maxSize = 3 * 1024 ** 2;// 3 MB
const iconStyles = {width: rem(20), height: rem(20), color: "#56595e"};

export default function NewSuspectPage() {
    const funcionario = useAppSelector(selectFuncionario);
    const [loading, setLoading] = useState<boolean>(false);
    const query = useQuery({
        enabled: true,
        // refetchOnMount: false,
        refetchInterval: false,
        // refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        queryKey: ["contries"],
        queryFn: () =>  paisService.findAll({}),
        onError: (error: any) => notifications.show({title: 'Paises', message: error.message || 'Não foi possível carregar os paises,', color: 'red'}),
    });

    const { register, handleSubmit, formState: { defaultValues, errors }, reset, setValue, getValues, watch } = useForm<DataForm>({
        defaultValues: {
            genero: GENERO.MASCULINO,
        },
        resolver: yupResolver(SuspectSchema),
    });
    
    const dataNascimento = register("dataNascimento");
    
    function onDrop(files:File[]) {
        setValue("foto", files[0]);
        console.log('accepted files', files)
    }

    function onReject(files:FileRejection[]) {
        notifications.show({title: 'Foto de Perfil', message: 'Permitido apeans arquivos de imagem.', color: 'red'});
    }

    function onSubmit(data: DataForm) {
        console.log('DATA: ', data);
        const formData = new FormData();
        formData.append("nome", data.nome);
        formData.append("genero", data.genero);
        formData.append("dataNascimento", data.dataNascimento);
        formData.append("detido", new String(data.detido).toString());
        formData.append("morada", data.morada);
        formData.append("biografia", data.biografia);
        formData.append("numero", data.numero);
        formData.append("bilheteIdentidade", data.bilheteIdentidade);
        formData.append("foto", data.foto as File);
        setLoading(true);
        suspeitoService.create(funcionario.id, data.pais, formData).then(response => {
            reset();
            const data = response.data;
            notifications.show({title: 'Suspeito', message: `Os dados do suspeito ${data.nome} foram salvos com sucesso!!!`, color: 'green'});
        }).catch((error)=>{
            console.log(error);
            notifications.show({title: 'Suspeito', message: error.message});
        }).finally(function(){
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

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Novo Suspeito</Typography>
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
                                <FormLabel id="demo-radio-buttons-group-label">Gênero:</FormLabel>
                                <RadioGroup value={watch().genero} onChange={(evt=> setValue('genero', evt.target.value as GENERO))} defaultValue={defaultValues?.genero} aria-labelledby="genero" row>
                                    <FormControlLabel label={Genero.MASCULINO} value={GENERO.MASCULINO} control={<Radio/>} />
                                    <FormControlLabel label={Genero.FEMININO} value={GENERO.FEMININO}  control={<Radio/>}/>
                                </RadioGroup>
                                <FormHelperText>Selecione o gênero do funcionário.</FormHelperText>
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

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Nacionalidade:</FormLabel>
                                <Select variant="outlined" {...register('pais')} fullWidth size="small" labelId="demo-multiple-name-label" id="demo-multiple-name" input={<OutlinedInput label="Pais" />} inputProps={{}} MenuProps={MenuProps} error={!!errors.pais?.message}>
                                    {query.data?.data.map((pais) => (
                                        <MenuItem key={pais.id} value={pais.id}>{pais.nome}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{errors.pais?.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel>Número:</FormLabel>
                                <TextField variant="outlined" {...register('numero')} label="Número" size="small" error={!!errors.numero?.message} helperText={errors.numero?.message} placeholder='Informe o número de telefone do funcionário...' fullWidth InputProps={{endAdornment: <IconPhone style={iconStyles} /> }}/>
                            </FormControl>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth sx={{gap: 1}}>
                                <FormLabel id="demo-radio-buttons-group-label">Biografia:</FormLabel>
                                <TextField {...register('biografia')} variant="outlined" label="Biografia" size="small" error={!!errors.biografia?.message} helperText={'Descreva em poucas palavras quem é você.'} placeholder='Informe sobre você...' minRows={12} maxRows={12} fullWidth multiline/>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth>
                                <FormLabel>Foto de Perfil:</FormLabel>
                                <Dropzone loading={loading} mt={10} name='fotoPerfil' onDrop={onDrop} onReject={onReject} maxSize={maxSize} maxFiles={1} accept={IMAGE_MIME_TYPE} multiple={false}>
                                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none'}}>
                                        <Dropzone.Accept>
                                            <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5}/>
                                        </Dropzone.Accept>
                                        
                                        <Dropzone.Reject>
                                            <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5}/>
                                        </Dropzone.Reject>

                                        <Dropzone.Idle>
                                            {watch("foto") ? (
                                                <Avatar size={'xl'} src={ URL.createObjectURL(watch("foto") as File)} />
                                            ) : (
                                                <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5}/>
                                            )}
                                        </Dropzone.Idle>
                                        <Box>
                                            <Text size="xl" inline>Arraste a imagen aqui ou clique para selecionar</Text>
                                            <Text size="sm" c="dimmed" inline mt={7}>Anexe um arquivo quiser, o arquivo não deve exceder 5mb.</Text>
                                        </Box>
                                    </Group>
                                </Dropzone>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                <LoadingButton loading={loading} type="submit" variant="contained" size="large" fullWidth disableElevation sx={{color: "#fff", borderRadius: "0 0 5px 5px", mt: 3}}>Salvar</LoadingButton>
            </Paper>
        </Stack>
    )
}
