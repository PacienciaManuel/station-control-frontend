import type { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import RefreshTokenProvider from '@/context/RefreshTokenProvider';


export const metadata: Metadata = {
    title: "Dashboard",
}

async function fetch(sleep: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(sleep);
        }, sleep);
    });
}

export default async function Layout({ children }: {children: React.ReactNode}) {
    const data  = await fetch(2000);
    return (
        <RefreshTokenProvider>
            <MainLayout>{children}</MainLayout>
        </RefreshTokenProvider> 
    )
}
