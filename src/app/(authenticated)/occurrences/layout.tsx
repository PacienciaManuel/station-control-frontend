import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Ocorrências",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <>{children}</>
    )
}
