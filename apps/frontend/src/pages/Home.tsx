import { css } from '@emotion/react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router-dom'

import Footer from '../components/Footer'
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
  }, [location.state, userEmail, setSnackBarContent])

  return (
    <div css={homeContainerStyle}>
      <Helmet>
        <title>Web Object Renderer</title>
        <meta
          name="description"
          content="Web Object Renderer – a secure platform for interacting with 3D .obj models in real-time."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Header />
      <div css={contentContainerStyle}>
        <WebObjectRenderer />
      </div>
      <Footer />
    </div>
  )
}
const homeContainerStyle = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`
const contentContainerStyle = css`
  flex: 1;
  position: relative;
`
export default Home
