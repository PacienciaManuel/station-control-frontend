import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pesquisa",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>

    )
}
