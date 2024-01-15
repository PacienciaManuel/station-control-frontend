"use client";

import sessionManager from '@/util/SessionManager';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { API_BASE_URL } from '@/service/api';


export default function ApolloClientProvider({ children }:{children: React.ReactNode}) {
    const httpLink = createHttpLink({
        uri: `${API_BASE_URL}/graphql`,
    });
      
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: sessionManager.accessToken() || "",
            }
        }
    });
    
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });    

    return (
        <ApolloProvider client={client}>{children} </ApolloProvider>
    )
}
