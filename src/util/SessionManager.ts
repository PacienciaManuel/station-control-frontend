import { deleteCookie, setCookie } from 'cookies-next';

interface ApiToken {
    apiTokenType: string,
    apiAccessToken: string,
    apiRefreshToken: string,
}

interface FrontendAuthorization extends ApiToken {
    frontendAuthorization: string,
}

export const FRONT_END_AUTHORIZATION = "authorization";

class SessionManager {
    private static SESSION = false;
    private static API_TOKEN_TYPE = "";
    private static API_ACCESS_TOKEN = ""; 
    private static API_REFRESH_TOKEN = ""; 
    
    session({ apiAccessToken, apiRefreshToken, apiTokenType, frontendAuthorization }:FrontendAuthorization) {
        SessionManager.SESSION = true;
        SessionManager.API_TOKEN_TYPE = apiTokenType;
        SessionManager.API_ACCESS_TOKEN = apiAccessToken;
        SessionManager.API_REFRESH_TOKEN = apiRefreshToken;
        setCookie(FRONT_END_AUTHORIZATION, frontendAuthorization);
    }
    
    refreshSession({ apiAccessToken, apiRefreshToken, apiTokenType }:ApiToken) {
        SessionManager.SESSION = true;
        SessionManager.API_TOKEN_TYPE = apiTokenType;
        SessionManager.API_ACCESS_TOKEN = apiAccessToken;
        SessionManager.API_REFRESH_TOKEN = apiRefreshToken;
    }
    
    isSession(){
        return SessionManager.SESSION;
    }
    
    clearSession(){
        SessionManager.SESSION = false;
        deleteCookie(FRONT_END_AUTHORIZATION);
        SessionManager.API_TOKEN_TYPE = "";
        SessionManager.API_ACCESS_TOKEN = "";
        SessionManager.API_REFRESH_TOKEN = "";
    }
    
    accessToken() {
        return SessionManager.API_TOKEN_TYPE + SessionManager.API_ACCESS_TOKEN;
    }
    
    refreshToken() {
        return SessionManager.API_TOKEN_TYPE + SessionManager.API_REFRESH_TOKEN;
    }

    updateTokens({ apiAccessToken, apiRefreshToken, apiTokenType }:ApiToken) {
        SessionManager.API_TOKEN_TYPE = apiTokenType;
        SessionManager.API_ACCESS_TOKEN = apiAccessToken;
        SessionManager.API_REFRESH_TOKEN = apiRefreshToken;
    }
}

const sessionManager = new SessionManager();

export default sessionManager;