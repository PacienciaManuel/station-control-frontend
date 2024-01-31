"use client";

import { useId } from "react";
import Crime from "@/model/Crime";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { Box, PopoverOrigin, Typography, alpha } from "@mui/material";
import PopupState, { InjectedProps, bindPopover } from "material-ui-popup-state";

interface CrimeDescriptionHoverProps {
    crime: Crime,
    anchorOrigin: PopoverOrigin,
    transformOrigin: PopoverOrigin,
    children: (props: InjectedProps) => any;
}

export default function CrimeDescriptionHover({crime, anchorOrigin, transformOrigin, children}:CrimeDescriptionHoverProps) {
    const popoverId = useId();

    return (
        <PopupState variant="popover" popupId={popoverId}>
        {(popupState) => (<>
            {children(popupState)}
            <HoverPopover {...bindPopover(popupState)} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} classes={{paper: "bg-transparent"}}>
                <Box sx={{p: 2, maxWidth: 320, maxHeight: 300, overflowY: "auto", bgcolor: alpha("#000", 0.8)}}>
                    <Typography variant="body2" sx={{color: "#fff"}}>{crime.descricao}</Typography>
                </Box>
            </HoverPopover>
        </>)}
        </PopupState>
    )
}
