import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';


export const metadata: Metadata = {
    title: "Dashboard",
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
        <MainLayout>{children}</MainLayout>

    )
}
