import { useQuery } from '@apollo/client'

import { GET_USER } from '../graphql/userQueries'

const useGetUser = (userId: string | null, skipQuery: boolean) => {
  return useQuery(GET_USER, {
    variables: { userId },
    skip: skipQuery, //Sprječava izvršavanje upita ako nemamo userId
    fetchPolicy: 'cache-first'
  })
}

export default useGetUser
