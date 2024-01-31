import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Novo Funcionário",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
