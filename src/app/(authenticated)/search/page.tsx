"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
    const search = useSearchParams();

    return (
        <div>SearchPage: {search.get("s")}</div>
    )
}
