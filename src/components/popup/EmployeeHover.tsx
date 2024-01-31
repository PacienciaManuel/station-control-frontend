"use client";

import dayjs from "dayjs";
import { useId } from "react";
import Funcionario from "@/model/Funcionario";
import toolsManager from "@/util/ToolsManager";
import resourceResolver from "@/util/ResourceResolver";
import { Avatar, Box, PopoverOrigin, Stack, Typography } from "@mui/material";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";

interface EmployeeHoverProps {
    funcionario: Funcionario,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

export default function EmployeeHover({funcionario, anchorOrigin, transformOrigin, children}:EmployeeHoverProps) {
    const popoverId = useId();

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}>
                <Stack spacing={2} direction="row" sx={{p: 2, alignItems: "center"}}>
                    <Avatar src={resourceResolver.profilePhoto(funcionario.fotoPerfil)} alt={funcionario.nome} sx={{width: 64, height: 64, color: "#fff", backgroundColor: toolsManager.generateColor(funcionario.nome)}}/>
                    <Stack>
                        <Typography variant="h6" sx={{fontWeight: "bold"}}>{funcionario.nome}</Typography>
                        <Typography variant="body1"><Box component="b">Email:</Box> {funcionario.email}</Typography>
                        <Typography variant="body1"><Box component="b">Ocorrências:</Box> {215}</Typography>
                        <Typography variant="body1"><Box component="b">Data de criação:</Box> {dayjs(funcionario.dataCriacao).format("DD/MM/YYYY HH:mm")}</Typography>
                        <Typography variant="body1"><Box component="b">Contactos:</Box> {funcionario.telefones?.map(t => t.numero).join(" / ")}</Typography>
                    </Stack>
                </Stack>
            </HoverPopover>
        </>)}
        </PopupState>
    )
}
