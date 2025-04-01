import { useMutation } from '@apollo/client'

import { CREATE_USER } from '../graphql/userMutations'

const useCreateUser = () => {
  return useMutation(CREATE_USER, {
    update(cache, { data }) {
      if (data?.createUser?.user) {
        cache.modify({
          id: cache.identify(data.createUser.user),
          fields: {
            id: () => data.createUser.user.id,
            name: () => data.createUser.user.name,
            email: () => data.createUser.user.email,
            profileImage: () => data.createUser.user.profileImage,
            fileMetadata: () => data.createUser.user.fileMetadata
          }
        })
      }
    }
  })
}

export default useCreateUser
