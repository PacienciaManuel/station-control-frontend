"use client";

import { useQueries } from "react-query";
import Grid from '@mui/material/Unstable_Grid2';
import useErrorHandler from "@/hooks/useErrorHandler";
import suspeitoOcorrenciaService from "@/service/SuspeitoOcorrenciaService";
import suspeitoService from "@/service/SuspeitoService";
import { Box, Card, CardActions, CardContent, CardMedia, Divider, Stack, Typography } from "@mui/material";
import resourceResolver from "@/util/ResourceResolver";
import { Text } from "@mantine/core";

interface SuspectProfilePageProps {
    params: {
        id: string,
    }
}

export default function SuspectProfilePage({params}:SuspectProfilePageProps) {
    const errorHandler = useErrorHandler("Suspeito");
    const [querySuspect, queryOccurrences] = useQueries([
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
            enabled: false,
            // refetchOnMount: false,
            refetchInterval: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            refetchIntervalInBackground: false,
            queryKey: ["queryPaginationOccurrencesBySuspect"],
            queryFn: () =>  suspeitoOcorrenciaService.findAll({suspeito: params.id}),
            onError: (error: any) => errorHandler(error),
        },
    ]);

    return (
        <Stack sx={{gap: 3}}>
            <Box>
                <Typography variant="h2">Suspeito</Typography>
                <Divider orientation="horizontal"/>
            </Box>
            
            <Grid spacing={3} container>
                <Grid xs={12} md={4}>
                    <Card>
                        <CardMedia
                            sx={{ height: 240 }}
                            image={resourceResolver.profilePhoto(querySuspect.data?.data.foto)}
                            title={querySuspect.data?.data.nome}
                        />
                        <CardContent>
                            <Stack sx={{alignItems: "center"}}>
                                <Typography gutterBottom variant="h6" component="div" align="center" noWrap sx={{maxWidth: "100%"}}>{querySuspect.data?.data.nome}</Typography>
                                <Typography gutterBottom variant="body2" component="div" align="center" noWrap sx={{maxWidth: "100%"}}><b>Ocorrências:</b> {querySuspect.data?.data.totalOcorrencias}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <Text lineClamp={2} style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit", textAlign: "center"}}>{querySuspect.data?.data.biografia}</Text>
                                </Typography>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{justifyContent: "center"}}>
                            {/* <Tooltip bg={'black'} label="Home" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                                <IconButton color="primary" LinkComponent={Link} href={`/suspects/${suspeito.id}`}>
                                    <IconHome style={iconStyles}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip bg={'black'} label="Editar" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                                <IconButton LinkComponent={Link} href={`/suspects/${suspeito.id}/edit`}>
                                    <IconEdit color="#ffd50f" style={iconStyles}/>
                                </IconButton>
                            </Tooltip>
                            {handleDelete && !loading && (
                                <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                                    <IconButton onClick={onDelete}>
                                        <IconTrash color="red" style={iconStyles}/>
                                    </IconButton>
                                </Tooltip>
                            )}
                            {loading && (
                                <ThreeDots
                                visible={true}
                                height="20"
                                width="20"
                                color="#f00"
                                radius="9"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                />
                            )} */}
                        </CardActions>
                    </Card>
                </Grid>
                <Grid xs={12} md={8}></Grid>
            </Grid>
        </Stack>
    )
}
