"use client";

import dayjs from 'dayjs';
import Funcionario from '@/model/Funcionario';
import { IconRss } from '@tabler/icons-react';
import { IconUsersGroup } from '@tabler/icons-react';
import EmployeeDetailsListItem from './EmployeeDetailsListItem';
import { Box, Divider, List, Paper, Typography } from '@mui/material';
import { IconCalendar, IconCalendarDue, IconGenderNeutrois, IconGlobe, IconMessage, IconPhone } from '@tabler/icons-react';

interface EmployeeDetailsProps {
    funcionario?: Funcionario
    totalSuspeitos?: number,
    totalRequerentes?: number,
    totalOcorrencias?: number,
}

export default function EmployeeDetails({funcionario, totalSuspeitos=0, totalRequerentes=0, totalOcorrencias=0}:EmployeeDetailsProps) {
    return (
        <Box elevation={0} component={Paper} sx={{p: 2,  color: theme => theme.palette.primary.contrastText, bgcolor: theme => theme.palette.background.default}}>
            <Typography variant="h5" sx={{fontWeight: 500}}>Nota Informativa</Typography>
            <Box sx={{maxHeight: 90, overflowX: "auto", mt: 2}}>
                <Typography variant="body2">{funcionario?.biografia} </Typography>
            </Box>
            <Divider orientation="horizontal" flexItem sx={{my: 2}}/>
            <List disablePadding sx={{"& *": {color: theme => theme.palette.primary.contrastText}}}>
                <EmployeeDetailsListItem primary={funcionario?.genero} secondary="Gênero" Icon={IconGenderNeutrois} />
                <EmployeeDetailsListItem primary={dayjs(funcionario?.dataNascimento).format("DD/MM/YYYY")} secondary="Data de nascimento" Icon={IconCalendar} />
                <EmployeeDetailsListItem primary={funcionario?.email} secondary="Região" Icon={IconMessage} />
                <EmployeeDetailsListItem primary={funcionario?.pais.nome} secondary="Região" Icon={IconGlobe} />
                <EmployeeDetailsListItem primary={funcionario?.telefones?.map(t => (t.numero)).join(" / ")} secondary="Telefones" Icon={IconPhone} />
                <EmployeeDetailsListItem primary={totalSuspeitos} secondary="Suspeitos Cadastrados" Icon={IconUsersGroup} />
                <EmployeeDetailsListItem primary={totalRequerentes} secondary="Requerentes Cadastrados" Icon={IconRss} />
                <EmployeeDetailsListItem primary={totalOcorrencias} secondary="Ocorrências Cadastradas" Icon={IconCalendarDue} />
            </List>
        </Box>
    )
}
