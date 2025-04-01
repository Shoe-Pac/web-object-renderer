const serverApiUrl: string = import.meta.env.VITE_SERVER_API_URL

export const uploadObjFileToAws = async (formData: FormData) => {
  const response = await fetch(`${serverApiUrl}/upload-file-aws`, {
    method: 'POST',
    body: formData
  })

  return response
}

export const uploadImageToAws = async (formData: FormData) => {
  const response = await fetch(`${serverApiUrl}/upload-image-aws`, {
    method: 'POST',
    body: formData
  })

  return response
}
