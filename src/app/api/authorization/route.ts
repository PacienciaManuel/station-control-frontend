import cryptoManager from "@/util/CryptoManager";

export async function POST(request: Request) {
    const body = await request.json();
    return Response.json({frontendAuthorization: cryptoManager.encrypt(JSON.stringify(body))});
}