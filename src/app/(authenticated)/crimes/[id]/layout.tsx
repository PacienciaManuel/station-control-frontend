import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Alterar Crime",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
