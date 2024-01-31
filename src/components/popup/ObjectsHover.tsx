"use client";

import Link from "next/link";
import { useId } from "react";
import { useQuery } from "react-query";
import { PuffLoader } from "react-spinners";
import Ocorrencia from "@/model/Ocorrencia";
import { notifications } from "@mantine/notifications";
import ocorrenciaService from "@/service/OcorrenciaService";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";
import { Box, PopoverOrigin, Stack, Typography, alpha, useTheme } from "@mui/material";
import objectoService from "@/service/ObjectoService";

interface ObjectsHoverProps {
    ocorrencia: Ocorrencia,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

const size = 5;

export default function ObjectsHover({ocorrencia, anchorOrigin, transformOrigin, children}:ObjectsHoverProps) {
    const theme = useTheme();
    const queryKey = useId();
    const popoverId = useId();
    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () =>  objectoService.pagination({page: 0, size, ocorrencia: ocorrencia.id}),
        onError: (error: any) => notifications.show({title: 'Objectos', message: error.message || 'Não foi possível carregar os objectos das ocorrências.', color: 'red'}),
    });

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 340, bgcolor: alpha("#000", 0.6)}}>
                    <Stack spacing={1}>
                    {query.data?.data.content.map((objecto, index) => (
                        <Typography key={index} noWrap sx={{color: "#fff"}}>{objecto}</Typography>
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
