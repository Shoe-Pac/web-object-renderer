import { useMutation } from '@apollo/client'

import { UPDATE_USER } from '../graphql/userMutations'
// import { GET_USER } from "../graphql/userQueries";

const useUpdateUser = () => {
  return useMutation(UPDATE_USER, {
    update(cache, { data }) {
      if (data?.updateUser) {
        cache.modify({
          id: cache.identify(data.updateUser),
          fields: {
            id: () => data.updateUser.id,
            name: () => data.updateUser.name,
            email: () => data.updateUser.email,
            profileImage: () => data.updateUser.profileImage,
            fileMetadata: () => data.updateUser.fileMetadata
          }
        })
      }
    }
    // refetchQueries: ({ data }) =>
    //   data?.updateUser
    //     ? [{ query: GET_USER, variables: { userId: data.updateUser.id } }]
    //     : [],
  })
}

export default useUpdateUser
