import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Notificações para Requerentes",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
