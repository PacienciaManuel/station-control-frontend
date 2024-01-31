"use client";

import useEmployeeURLProfile from "@/hooks/useEmployeeURLProfile";
import Funcionario from "@/model/Funcionario";
import Papel from "@/model/Papel";
import resourceResolver from "@/util/ResourceResolver";
import { Chip, Text, Tooltip, rem } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Box, Card, CardActions, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { IconHome, IconShieldLock, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { ThreeDots } from 'react-loader-spinner';
import { useCallback, useState } from "react";

interface CardEmployeeProps {
    funcionario: Funcionario,
    handleDelete?: (funcionario:Funcionario, setLoading: (loading: boolean) => void) => void, 
}

const iconStyles = {width: rem(20), height: rem(20)};

export default function CardEmployee({funcionario, handleDelete}:CardEmployeeProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const employeeURLProfile = useEmployeeURLProfile(funcionario);
    const onDelete = useCallback((evt:React.MouseEvent<HTMLButtonElement>) => {
        if (!handleDelete) return;
        modals.openConfirmModal({
            title: 'Exclusão de Funcionário',
            children: (
                <Typography variant="body2" sx={{color: "#000"}}>
                    <Text style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit"}}>
                        Deseja excluir os dados do/a funcionário/a <b>{funcionario.nome}</b>?.
                    </Text>
                </Typography>
            ),
            labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
            onConfirm: () => handleDelete(funcionario, setLoading),
            onCancel: () => notifications.show({title: 'Exclusão de Funcionário', message: "Operação cancelada com sucesso.", color: "blue"}),
        });
    }, [handleDelete, funcionario]);

    return (
        <Card>
            <CardMedia
                sx={{ height: 240 }}
                image={resourceResolver.profilePhoto(funcionario.fotoPerfil)}
                title={funcionario.nome}
            />
            <CardContent>
                <Stack sx={{alignItems: "center"}}>
                    <Typography gutterBottom variant="h6" component="div" align="center" noWrap sx={{maxWidth: "100%"}}>{funcionario.nome}</Typography>
                    <Chip icon={<IconShieldLock style={{width: rem(24), height: rem(24)}} />} color={funcionario.papel === Papel.ADMINISTRADOR ? "orange" : "green"} variant="light" size="xs" checked>{funcionario.papel}</Chip>
                    <Typography variant="body2" color="text.secondary">
                        <Text lineClamp={2} style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit", textAlign: "center"}}>{funcionario.biografia}</Text>
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{justifyContent: "center"}}>
                <Tooltip bg={'black'} label="Home" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                    <IconButton LinkComponent={Link} href={employeeURLProfile}>
                        <IconHome style={iconStyles}/>
                    </IconButton>
                </Tooltip>
                {handleDelete && !loading && (
                    <Tooltip bg={'black'} label="Excluir" position='top' transitionProps={{transition: 'slide-down'}} withArrow>
                        <IconButton color="primary" onClick={onDelete}>
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
