import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Esqueceu a Senha",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
