import cryptoManager from "./util/CryptoManager";
import { NextRequest, NextResponse } from "next/server";
import { FRONT_END_AUTHORIZATION } from "./util/SessionManager";

const protectedRoutes = [
    "/applicants", "/bulletins", "/crimes",
    "/employees", "/notifications", "/occurrences", 
    "/profile", "/report", "/search", "/security&privacy", 
    "/settings", "/suspects",
];

export default async function middleware(request: NextRequest) {
    const cookie = request.cookies.get(FRONT_END_AUTHORIZATION);
    const protectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    // Verifica se é a rota raiz
    if ((request.nextUrl.pathname === "/" && !cookie) || (request.nextUrl.pathname === "/" && cookie && !cryptoManager.decrypt(cookie.value))) {
        const absoluteURL = new URL("/login", request.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    // Verifica se é uma rota protegida
    if ((!cookie && protectedRoute)|| (cookie && protectedRoute && !cryptoManager.decrypt(cookie.value))) {
        const absoluteURL = new URL("/login", request.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}