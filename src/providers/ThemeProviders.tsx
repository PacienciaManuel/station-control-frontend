'use client';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { MantineProvider, createTheme as createMantineTheme, } from '@mantine/core';

import "dayjs/locale/pt-br"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            "500": "#727cf5"
        },
        secondary: {
            main: "#aab8c5",
            contrastText: "#aab8c5"
        },
        background: {
            paper: "#37404a",
        },
    },
    typography: {
        fontFamily: '"__Nunito_3dc409", "__Nunito_Fallback_3dc409", "Arial",sans-serif',
        fontWeightMedium: 700,
    },
    components: {
        MuiDivider: {
            defaultProps: {
                style: {
                    borderColor: "#8391a2",
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none !important",
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: "#aab8c5 !important",
                }
            }
        }
    }
});

const mantineTheme = createMantineTheme({
    headings: {
        fontFamily: '"__Nunito_3dc409", "__Nunito_Fallback_3dc409", "Arial",sans-serif',
    },
    colors: {
        blue: ["#E7F5FF","#D0EBFF","#A5D8FF","#74C0FC","#4DABF7","#339AF0","#1488fa","#1C7ED6","#1971C2","#1864AB"]
    }
});

export default function ThemeProviders({ children }:{children: React.ReactNode}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <MantineProvider theme={mantineTheme} defaultColorScheme="light">
                <Notifications  position="bottom-right" zIndex={3000} />
                <ModalsProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        { children }
                    </ThemeProvider>
                </ModalsProvider>
            </MantineProvider>
        </LocalizationProvider>
    )
}
