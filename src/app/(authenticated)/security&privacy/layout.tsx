import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Segurança e Privacidade",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>

    )
}
