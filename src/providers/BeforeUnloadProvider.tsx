"use client";

import { useRouter } from 'next/navigation';
import sessionManager from '@/util/SessionManager';
import { useCallback, useEffect, useRef } from 'react';

export default function BeforeUnloadProvider({ children }:{children: React.ReactNode}) {
    const router = useRouter();
    const windowRef = useRef<Window>();

    const handleLogout = useCallback(() => {
        sessionManager.clearSession();
        router.replace("/login");
    }, [router])

    useEffect(() => {
        if (!windowRef.current) {
            windowRef.current = window;
            console.log("BeforeUnloadProvider")
            windowRef.current.addEventListener("beforeunload", handleLogout);
        }
    }, [handleLogout]);
    
    return (
        <>{children}</>
    )
}
