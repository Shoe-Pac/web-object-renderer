const serverApiUrl: string = import.meta.env.VITE_SERVER_API_URL

export const login = async (email: string, password: string) => {
  const response = await fetch(`${serverApiUrl}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  return response
}

//Fetch user id through cookie token verification
export const authenticate = async () => {
  const response = await fetch(`${serverApiUrl}/authenticate`, {
    credentials: 'include',
    method: 'POST'
  })

  return response
}

export const logout = async () => {
  const response = await fetch(`${serverApiUrl}/logout`, {
    method: 'POST',
    credentials: 'include'
  })

  return response
}

export const validatePassword = async (email: string, userCurrentPassword: string) => {
  const response = await fetch(`${serverApiUrl}/validate-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, userCurrentPassword })
  })

  return response
}
