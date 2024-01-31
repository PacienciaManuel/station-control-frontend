"use client";

import NextLink from "next/link";
import { rem } from "@mantine/core";
import { useCallback } from "react";
import CountUp from 'react-countup';
import { PuffLoader } from "react-spinners";
import { IconPlus } from "@tabler/icons-react";
import { Box, Button, Link, Paper, Stack, Typography, useTheme } from '@mui/material';

interface CounterProps {
    label: string,
    urlNew: string,
    urlList: string,
    counter: number,
    loading: boolean,
    color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
}

export default function Counter({ label, loading, counter, urlList, urlNew, color }:CounterProps) {
    const theme = useTheme();

    const handleStart = useCallback((start: () => any) => {
        start();
    }, []);    

    return (
        <Stack elevation={0} component={Paper} sx={{
            p: 2, 
            borderBottom: theme => `10px solid ${theme.palette[color].main}`,
        }}>
            <Typography variant="h5" sx={{fontWeight: 700}}>{label}</Typography>
            <Box sx={{
                width: 140,
                height: 140,
                display: "flex",
                borderRadius: "50%",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                border: theme => `5px solid ${theme.palette[color].main}`,
            }}>
                {loading ? <PuffLoader color={theme.palette[color].main} /> : (
                    <CountUp start={0} end={counter} duration={10} separator=".">
                        {({ countUpRef, start }) => (
                            <Typography component="span" ref={countUpRef} onLoad={() => handleStart(start)} variant="h5" sx={{fontWeight: 700}}>0</Typography>
                        )}
                    </CountUp>
                )}
            </Box>
            <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                <Link component={NextLink} href={urlList}>Ver todos</Link>
                <Button variant="text" LinkComponent={NextLink} color={color} href={urlNew} startIcon={<IconPlus style={{width: rem(18), height: rem(18)}}/>}>Novo</Button>
            </Stack>
        </Stack>
    )
}
