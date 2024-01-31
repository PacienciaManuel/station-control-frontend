"use client";

import { useId } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { PuffLoader } from "react-spinners";
import Funcionario from "@/model/Funcionario";
import { notifications } from "@mantine/notifications";
import requerenteService from "@/service/RequerenteService";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import useEmployeeURLProfile from "@/hooks/useEmployeeURLProfile";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";
import { Box, PopoverOrigin, Stack, Typography, alpha, useTheme } from "@mui/material";

interface EmployeeApplicantsHoverProps {
    funcionario: Funcionario,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

const size = 10;

export default function EmployeeApplicantsHover({funcionario, anchorOrigin, transformOrigin, children}:EmployeeApplicantsHoverProps) {
    const theme = useTheme();
    const queryKey = useId();
    const popoverId = useId();
    const employeeURLProfile = useEmployeeURLProfile(funcionario);
    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () =>  requerenteService.pagination({page: 0, size, funcionario: funcionario.id}),
        onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar os requerentes.', color: 'red'}),
    },)

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 320, bgcolor: alpha("#000", 0.6)}}>
                    <Stack spacing={1}>
                    {query.data?.data.content.map((applicant, index) => (
                        <Typography component={Link} href={`/applicants/${applicant.id}`} key={index} noWrap sx={{color: "#fff", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{applicant.nome}</Typography>
                    ))}
                    </Stack>
                    { query.data?.data && query.data?.data.totalElements - size > 0 && <Typography component={Link} href={`/applicants`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>+ {query.data?.data.totalElements - size}</Typography>}
                    { query.data?.data && query.data?.data.totalElements === 0 && <Typography component={Link} href={employeeURLProfile} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{query.data?.data.totalElements}</Typography>}
                    {query.isLoading && (
                        <Stack direction="row" sx={{justifyContent: "center"}}>
                            <PuffLoader color={theme.palette.primary.main} />
                        </Stack>
                    )}
                </Box>
            </HoverPopover>
        </>)}
        </PopupState>
    )
}
