import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import ReduxProvider from '@/redux/ReduxProvider';
import ThemeProviders from '@/providers/ThemeProviders';
import BeforeUnloadProvider from '@/providers/BeforeUnloadProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Station Control',
    description: 'Esta é uma aplicação para o gereciamento de uma delegacia policial.',
}

export default function RootLayout({ children }: {children: React.ReactNode}) {
    return (
        <html lang="pt_AO">
            <head>
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
                {/* <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css"/>
                <link href="assets/css/app.min.css" rel="stylesheet" type="text/css" id="light-style"/>
                <link href="assets/css/app-dark.min.css" rel="stylesheet" type="text/css" id="dark-style"/> */}
            </head>
            <body className={nunito.className}>
                <ReduxProvider>
                    <ReactQueryProvider>
                        <ThemeProviders>
                            <BeforeUnloadProvider>
                                {children}
                            </BeforeUnloadProvider>
                        </ThemeProviders>
                    </ReactQueryProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
