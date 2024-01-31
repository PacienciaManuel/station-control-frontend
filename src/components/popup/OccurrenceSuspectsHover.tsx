"use client";

import { useId } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { PuffLoader } from "react-spinners";
import Ocorrencia from "@/model/Ocorrencia";
import { notifications } from "@mantine/notifications";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import suspeitoOcorrenciaService from "@/service/SuspeitoOcorrenciaService";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";
import { Box, PopoverOrigin, Stack, Typography, alpha, useTheme } from "@mui/material";

interface OccurrenceSuspectsHoverProps {
    ocorrencia: Ocorrencia,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

const size = 10;

export default function OccurrenceSuspectsHover({ocorrencia, anchorOrigin, transformOrigin, children}:OccurrenceSuspectsHoverProps) {
    const theme = useTheme();
    const popoverId = useId();
    const queryKey = useId();
    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () =>  suspeitoOcorrenciaService.pagination({page: 0, size, ocorrencia: ocorrencia.id}),
        onError: (error: any) => notifications.show({title: 'Suspeitos', message: error?.response?.data?.message || 'Não foi possível carregar os suspeitos da ocorrência.', color: 'red'}),
    },)

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 320, bgcolor: alpha("#000", 0.6)}}>
                    <Stack spacing={1}>
                    {query.data?.data.content.map((suspeitoOcorrecia, index) => (
                        <Typography component={Link} href={`/suspects/${suspeitoOcorrecia.suspeito.id}`} key={index} noWrap sx={{color: "#fff", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{suspeitoOcorrecia.suspeito.nome}</Typography>
                    ))}
                    </Stack>
                    { query.data?.data && query.data?.data.totalElements - size > 0 && <Typography component={Link} href={`/occurrences/${ocorrencia.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>+ {query.data?.data.totalElements - size}</Typography>}
                    { query.data?.data && query.data?.data.totalElements === 0 && <Typography component={Link} href={`/occurrences/${ocorrencia.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{query.data?.data.totalElements}</Typography>}
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
