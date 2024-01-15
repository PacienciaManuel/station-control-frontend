import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Station Control',
    description: 'Esta é uma aplicação para o gereciamento de uma delegacia policial.',
}

export default function RootLayout({ children }: {children: React.ReactNode}) {
    return (
        <html lang="pt_AO">
            <head>
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    )
}
