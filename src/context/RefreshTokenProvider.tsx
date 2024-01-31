"use client";

import api from "@/service/api";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Typography } from "@mui/material";
import { createContext, useEffect, useState } from "react";

interface RefreshTokenContextProps {
    fetching: boolean,
    required: boolean,
}

export const RefreshTokenContext = createContext<RefreshTokenContextProps>({} as RefreshTokenContextProps);

export default function RefreshTokenProvider({children}: {children: React.ReactNode}) {
    const [refreshToken, setRefreshToken] = useState<RefreshTokenContextProps>({fetching: false, required: false});
    api.interceptors.response.use((response) => response, async function (error) {
            const originalRequest = error.config;
            // console.log("ERROR RESPONSE: ", error);
            // if (error.response.status === 403 && !originalRequest._retry && !fetchingRefreshToken) {
            if (error.response.status === 403 && !originalRequest._retry, !refreshToken.required) {
                // setRefreshToken({fetching: false, required: true});
                // return api(originalRequest);
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (!refreshToken.required) return;
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Typography variant="body2">
                    <Text style={{fontSize: "inherit", color: "inherit", fontWeight: "inherit"}}>
                        This action is so important that you are required to confirm it with a modal. Please click
                        one of these buttons to proceed.
                    </Text>
                </Typography>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => console.log('Confirmed'),
        });
        notifications.show({title: 'Refresh Token', message: 'Refresh token required', color: 'green'});
    }, [refreshToken.required]);
    
    return (
        <RefreshTokenContext.Provider value={refreshToken}>{children}</RefreshTokenContext.Provider>
    )
}
