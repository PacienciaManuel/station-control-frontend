"use client";

import { useId } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import Suspeito from "@/model/Suspeito";
import { PuffLoader } from "react-spinners";
import timeAgoManager from "@/util/TimeAgoManager";
import { notifications } from "@mantine/notifications";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import suspeitoOcorrenciaService from "@/service/SuspeitoOcorrenciaService";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";
import { Box, PopoverOrigin, Stack, Typography, alpha, useTheme } from "@mui/material";

interface SuspectOccurrencesHoverProps {
    suspeito: Suspeito,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

const size = 10;

export default function SuspectOccurrencesHover({suspeito, anchorOrigin, transformOrigin, children}:SuspectOccurrencesHoverProps) {
    const theme = useTheme();
    const popoverId = useId();
    const queryKey = useId();
    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () =>  suspeitoOcorrenciaService.pagination({page: 0, size, suspeito: suspeito.id}),
        onError: (error: any) => notifications.show({title: 'Ocorrencias', message: error.message || 'Não foi possível carregar as ocorrêrncias do suspeito.', color: 'red'}),
    },)

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 320, bgcolor: alpha("#000", 0.6)}}>
                    <Stack spacing={1}>
                    {query.data?.data.content.map((suspeitoOcorrencia, index) => (
                        <Typography component={Link} href={`/occurrences/${suspeitoOcorrencia.ocorrencia.id}`} key={index} noWrap sx={{color: "#fff", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{suspeitoOcorrencia.ocorrencia.status} - {timeAgoManager.timeago(suspeitoOcorrencia.ocorrencia.dataCriacao)}</Typography>
                    ))}
                    </Stack>
                    { query.data?.data && query.data?.data.totalElements - size > 0 && <Typography component={Link} href={`/suspects/${suspeito.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>+ {query.data?.data.totalElements - size}</Typography>}
                    { query.data?.data && query.data?.data.totalElements === 0 && <Typography component={Link} href={`/suspects/${suspeito.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{query.data?.data.totalElements}</Typography>}
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
