import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const serverApiUrl: string = import.meta.env.VITE_SERVER_API_URL

const httpLink = createHttpLink({
  uri: `${serverApiUrl}/graphql`,
  credentials: 'include' //For cookie-based authentication
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      UserType: {
        keyFields: ['id'], //Normalization by user ID
        fields: {
          fileMetadata: {
            merge(_existing = [], incoming) {
              return incoming
            }
          }
        }
      }
    }
  })
})

export default client
