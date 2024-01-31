"use client";

import { LoadingOverlay } from "@mantine/core";
import { Box, useTheme } from "@mui/material";

export default function MainLoading() {
    const theme = useTheme();
    return (
        <Box sx={{display: "flex", flex: 1, height: "calc(100vh - 100px)", justifyContent: "center", alignItems: "center",}}>
            <Box sx={{position: "relative", minWidth: 80, minHeight: 80}}>
                <LoadingOverlay
                    zIndex={1000}
                    visible={true} 
                    transitionProps={{duration: 1000}} 
                    loaderProps={{ color: theme.palette.primary.main, type: 'bars', size: "xl" }}
                    overlayProps={{ radius: 'sm', blur: 0, bg: 'rgba(0,0,0,0)' }}
                />
            </Box>
        </Box>
    )
}
