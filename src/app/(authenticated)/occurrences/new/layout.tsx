import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Nova Ocorrência",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
