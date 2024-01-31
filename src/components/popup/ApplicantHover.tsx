"use client";

import dayjs from "dayjs";
import { useId } from "react";
import Requerente from "@/model/Requerente";
import toolsManager from "@/util/ToolsManager";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { Avatar, Box, PopoverOrigin, Stack, Typography } from "@mui/material";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";

interface ApplicantHoverProps {
    requerente: Requerente,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

export default function ApplicantHover({requerente, anchorOrigin, transformOrigin, children}:ApplicantHoverProps) {
    const popoverId = useId();

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}>
                <Stack spacing={2} direction="row" sx={{p: 2, alignItems: "center"}}>
                    <Avatar alt={requerente.nome} sx={{width: 64, height: 64, color: "#fff", backgroundColor: toolsManager.generateColor(requerente.nome)}}>{requerente.nome.charAt(0).toUpperCase()} </Avatar>
                    <Stack>
                        <Typography variant="h6" sx={{fontWeight: "bold"}}>{requerente.nome}</Typography>
                        <Typography variant="body1"><Box component="b">Ocorrências:</Box> {215}</Typography>
                        <Typography variant="body1"><Box component="b">Data de criação:</Box> {dayjs(requerente.dataCriacao).format("DD/MM/YYYY HH:mm")}</Typography>
                        <Typography variant="body1"><Box component="b">Contactos:</Box> {requerente.telefone.numero}</Typography>
                    </Stack>
                </Stack>
            </HoverPopover>
        </>)}
        </PopupState>
    )
}
