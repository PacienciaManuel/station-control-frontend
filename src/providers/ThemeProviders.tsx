'use client';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { MantineProvider, createTheme as createMantineTheme, rem, } from '@mantine/core';

import "dayjs/locale/pt-br"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            "500": "#727cf5",
            contrastText: "#aab8c5",
        },
        background: {
            paper: "#f0f8ff",
            default: "#37404a",
        },
    },
    typography: {
        fontFamily: '"Nunito", "Arial",sans-serif',
        fontWeightMedium: 700,
        h1: {
            fontSize: rem(64),
        },
        h2: {
            fontSize: rem(32),
        },
        h3: {
            fontSize: rem(26),
        },
        h4: {
            fontSize: rem(24),
        },
        h5: {
            fontSize: rem(20),
        },
        h6: {
            fontSize: rem(16),
        },
        body1: {
            fontSize: rem(14),
        },
        body2: {
            fontSize: rem(12),
        },
        subtitle1: {
            fontSize: rem(10),
        },
        subtitle2: {
            fontSize: rem(8),
        },
    },
    components: {
        MuiDivider: {
            defaultProps: {
                style: {
                    borderColor: "#aab8c5",
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    color: "#3c4c6d",
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
