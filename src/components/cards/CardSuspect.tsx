"use client";

import useEmployeeURLProfile from "@/hooks/useEmployeeURLProfile";
import Funcionario from "@/model/Funcionario";
import Papel from "@/model/Papel";
import resourceResolver from "@/util/ResourceResolver";
import { Chip, Text, Tooltip, rem } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { IconEdit, IconHome, IconShieldLock, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { ThreeDots } from 'react-loader-spinner';
import { useCallback, useState } from "react";
import Suspeito from "@/model/Suspeito";

interface CardSuspectProps {
    suspeito: Suspeito,
    handleDelete?: (suspeito:Suspeito, setLoading: (loading: boolean) => void) => void, 
}

const iconStyles = {width: rem(20), height: rem(20)};

export default function CardSuspect({suspeito, handleDelete}:CardSuspectProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const onDelete = useCallback((evt:React.MouseEvent<HTMLButtonElement>) => {
        if (!handleDelete) return;
        modals.openConfirmModal({
            title: 'Exclusão de Suspeito',
            children: (
                <Typography variant="body2" sx={{color: "#000"}}>
                    <Text style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit"}}>
                        Deseja excluir os dados do/a suspeito/a <b>{suspeito.nome}</b>?
                    </Text>
                </Typography>
            ),
            labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
            onConfirm: () => handleDelete(suspeito, setLoading),
            onCancel: () => notifications.show({title: 'Exclusão de Suspeito', message: "Operação cancelada com sucesso.", color: "blue"}),
        });
    }, [handleDelete, suspeito]);

    return (
        <Card>
            <CardMedia
                sx={{ height: 240 }}
                image={resourceResolver.profilePhoto(suspeito.foto)}
                title={suspeito.nome}
            />
            <CardContent>
                <Stack sx={{alignItems: "center"}}>
                    <Typography gutterBottom variant="h6" component="div" align="center" noWrap sx={{maxWidth: "100%"}}>{suspeito.nome}</Typography>
                    <Typography gutterBottom variant="body2" component="div" align="center" noWrap sx={{maxWidth: "100%"}}><b>Ocorrências:</b> {suspeito.totalOcorrencias}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        <Text lineClamp={2} style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit", textAlign: "center"}}>{suspeito.biografia}</Text>
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{justifyContent: "center"}}>
                <Tooltip bg={'black'} label="Home" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
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
                )}
            </CardActions>
        </Card>
    )
}
