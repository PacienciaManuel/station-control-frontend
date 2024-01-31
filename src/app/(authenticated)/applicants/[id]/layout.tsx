import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Perfil do Requerente",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
