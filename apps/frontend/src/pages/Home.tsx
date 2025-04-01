import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Header from '../components/Header'
import WebObjectRenderer from '../components/web-object-renderer/WebObjectRenderer'
import useAuth from '../hooks/useAuth'
import useSnackBar from '../hooks/useSnackBar'

const Home = () => {
  const location = useLocation()
  const { setSnackBarContent } = useSnackBar()
  const { userEmail } = useAuth()

  useEffect(() => {
    if (userEmail) {
      if (location.state?.from === '/login') {
        setSnackBarContent((prev) => ({
          ...prev,
          message: `Welcome ${userEmail}!`,
          severity: 'info'
        }))
      }
    }
  }, [location.state, userEmail])

  return (
    <>
      <Header />
      <WebObjectRenderer />
    </>
  )
}

export default Home
