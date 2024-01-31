"use client";

import { useId } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { PuffLoader } from "react-spinners";
import Requerente from "@/model/Requerente";
import timeAgoManager from "@/util/TimeAgoManager";
import { notifications } from "@mantine/notifications";
import ocorrenciaService from "@/service/OcorrenciaService";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";
import { Box, PopoverOrigin, Stack, Typography, alpha, useTheme } from "@mui/material";

interface ApplicantOccurrencesHoverProps {
    requerente: Requerente,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

const size = 10;

export default function ApplicantOccurrencesHover({requerente, anchorOrigin, transformOrigin, children}:ApplicantOccurrencesHoverProps) {
    const theme = useTheme();
    const popoverId = useId();
    const queryKey = useId();
    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () =>  ocorrenciaService.pagination({page: 0, size, requerente: requerente.id}),
        onError: (error: any) => notifications.show({title: 'Suspeitos', message: error.message || 'Não foi possível carregar as ocorr^rncias.', color: 'red'}),
    },)

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 320, bgcolor: alpha("#000", 0.6)}}>
                    <Stack spacing={1}>
                    {query.data?.data.content.map((occurrence, index) => (
                        <Typography component={Link} href={`/occurrences/${requerente.id}`} key={index} noWrap sx={{color: "#fff", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{occurrence.status} - {timeAgoManager.timeago(occurrence.dataCriacao)}</Typography>
                    ))}
                    </Stack>
                    { query.data?.data && query.data?.data.totalElements - size > 0 && <Typography component={Link} href={`/applicants/${requerente.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>+ {query.data?.data.totalElements - size}</Typography>}
                    { query.data?.data && query.data?.data.totalElements === 0 && <Typography component={Link} href={`/applicants/${requerente.id}`} noWrap sx={{color: "#fff", mt: 1, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}>{query.data?.data.totalElements}</Typography>}
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
