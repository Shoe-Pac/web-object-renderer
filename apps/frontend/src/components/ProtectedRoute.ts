import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import { authenticate, logout } from '../utils/api-services/auth'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate()
  const { userId, setUserId, setUserEmail } = useAuth()

  useEffect(() => {
    const handleLogout = async () => {
      await logout()
      navigate('/', { replace: true })
    }

    const checkAuth = async () => {
      try {
        const response = await authenticate()

        if (response.ok) {
          const responseData = await response.json()

          setUserId(responseData.user.id)
          setUserEmail(responseData.user.email)
        } else {
          handleLogout()
        }
      } catch (error) {
        console.error(error)
        handleLogout()
      }
    }

    checkAuth()
  }, [navigate, setUserId, setUserEmail])

  return userId ? children : null
}

export default ProtectedRoute
