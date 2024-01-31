"use client";

interface ApplicantDetailsPageProps {
    params: {
        id: string,
    }
}

export default function ApplicantProfilePage({params}:ApplicantDetailsPageProps) {
    return (
        <div>page: {params.id}</div>
    )
}
